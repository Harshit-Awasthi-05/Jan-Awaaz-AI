from fastapi import APIRouter, BackgroundTasks, status, UploadFile, File, Form, Depends, Request
from fastapi.responses import PlainTextResponse
from typing import Optional
import time
import os
import httpx

from app.api.ingestion.schemas import CitizenReportIncoming, WhatsAppWebhookPayload, CitizenAppPayload
from app.api.ingestion.media_utils import CloudinaryManager
from app.core.security import verify_citizen_token
from app.core.config import settings
from app.core.logger import log
from app.core.ai_service import analyze_citizen_report
from app.core.firebase import get_or_create_citizen_uid
from app.api.complaints.services import create_complaint

router = APIRouter(prefix="/ingestion", tags=["Ingestion Layer"])
media_manager = CloudinaryManager()


def _extract_phone(raw: str) -> str:
    return raw.replace("whatsapp:", "")


def _send_whatsapp_reply(to: str, body: str) -> None:
    try:
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Ensure the from_ number is prefixed with 'whatsapp:'
        sender_number = settings.TWILIO_WHATSAPP_NUMBER
        if not sender_number.startswith("whatsapp:"):
            sender_number = f"whatsapp:{sender_number}"
            
        client.messages.create(
            from_=sender_number,
            to=to,
            body=body,
        )
        log.info(f"WhatsApp reply sent to {to}")
    except Exception as e:
        log.error(f"Failed to send WhatsApp reply to {to}: {e}")


async def _download_twilio_media(media_url: str) -> bytes:
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            media_url,
            auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
            follow_redirects=True,
        )
        response.raise_for_status()
        return response.content




async def process_whatsapp_complaint(
    phone_number: str,
    raw_from: str,
    text_body: Optional[str],
    media_url: Optional[str],
    media_content_type: Optional[str],
    profile_name: Optional[str],
):
    log.info(f"Processing WhatsApp complaint from {phone_number}")

    citizen_uid = get_or_create_citizen_uid(phone_number)

    public_media_url = None
    file_bytes = None
    if media_url:
        try:
            file_bytes = await _download_twilio_media(media_url)
            filename = f"wa_{int(time.time())}_{phone_number.replace('+', '')}"
            public_media_url = await media_manager.upload_media(
                file_bytes=file_bytes,
                filename=filename,
            )
            log.info(f"WhatsApp media uploaded to Cloudinary: {public_media_url}")
        except Exception as e:
            log.error(f"Failed to process WhatsApp media from {phone_number}: {e}")

    
    description = text_body or ""
    if not description and not file_bytes:
        description = "Citizen sent a WhatsApp message with no text or media."

    ai_insights = analyze_citizen_report(
        text_content=description,
        file_bytes=file_bytes,
        language="hi",
    )
    log.info(f"AI analysis complete for WhatsApp from {phone_number}: {ai_insights}")

    complaint_id = create_complaint(
        citizen_uid=citizen_uid,
        channel="whatsapp",
        category=ai_insights.get("category"),
        severity=ai_insights.get("severity"),
        summary=ai_insights.get("summary"),
        action_insight=ai_insights.get("actionable_insight"),
        media_url=public_media_url,
        latitude=None,
        longitude=None,
        constituency=os.environ.get("MP_CONSTITUENCY"),
    )
    log.info(f"WhatsApp complaint saved: ID={complaint_id} for citizen {citizen_uid}")

    
    reply = (
        f"✅ आपकी शिकायत दर्ज हो गई है!\n\n"
        f"📋 शिकायत ID: {complaint_id}\n"
        f"📂 श्रेणी: {ai_insights.get('category', 'N/A')}\n"
        f"⚠️ गंभीरता: {ai_insights.get('severity', 'N/A')}\n\n"
        f"हम जल्द से जल्द इस पर कार्रवाई करेंगे।\n"
        f"Thank you for reporting!"
    )
    _send_whatsapp_reply(to=raw_from, body=reply)


async def process_app_file(
    app_data: CitizenAppPayload,
    file_bytes: bytes,
    filename: str,
    content_type: str,
):
    log.info(f"App Upload received from Firebase UID: {app_data.citizen_id}")
    log.info(f"File Type: {content_type}")
    log.info(f"Location: Lat {app_data.latitude}, Lng {app_data.longitude}")

    public_url = await media_manager.upload_media(file_bytes=file_bytes, filename=filename)
    log.info(f"Media secured at: {public_url}")

    log.info("Triggering Gemini AI Analysis...")
    ai_insights = analyze_citizen_report(
        text_content=app_data.description,
        file_bytes=file_bytes,
        language=app_data.language,
    )
    log.info(f"AI Extraction Complete: {ai_insights}")

    complaint_id = create_complaint(
        citizen_uid=app_data.citizen_id,
        channel="app",
        category=ai_insights.get("category"),
        severity=ai_insights.get("severity"),
        summary=ai_insights.get("summary"),
        action_insight=ai_insights.get("actionable_insight"),
        media_url=public_url,
        latitude=app_data.latitude,
        longitude=app_data.longitude,
        constituency=app_data.constituency,
    )
    log.info(f"Complaint saved with ID: {complaint_id}")


async def process_generic_webhook(payload: CitizenReportIncoming):
    log.info(f"Generic webhook received for user: {payload.user_id}")
    if payload.media_url:
        log.info(f"Media URL to process: {payload.media_url}")
    log.info("Ready for AI Processing.")



@router.post("/whatsapp")
async def whatsapp_webhook(request: Request, background_tasks: BackgroundTasks):
    form_data = await request.form()
    log.info(f"WhatsApp webhook received: {dict(form_data)}")

    raw_from = form_data.get("From", "")
    body = form_data.get("Body", "")
    num_media = int(form_data.get("NumMedia", 0))
    media_url = form_data.get("MediaUrl0") if num_media > 0 else None
    media_content_type = form_data.get("MediaContentType0") if num_media > 0 else None
    profile_name = form_data.get("ProfileName", "")

    phone_number = _extract_phone(raw_from)

    if not phone_number:
        log.warning("WhatsApp webhook received with no 'From' number, ignoring.")
        return PlainTextResponse("ignored", status_code=200)

    background_tasks.add_task(
        process_whatsapp_complaint,
        phone_number=phone_number,
        raw_from=raw_from,
        text_body=body or None,
        media_url=media_url,
        media_content_type=media_content_type,
        profile_name=profile_name,
    )

    return PlainTextResponse("", status_code=200)


@router.post("/app-upload")
async def app_media_upload(
    background_tasks: BackgroundTasks,
    citizen_uid: str = Depends(verify_citizen_token),
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    constituency: Optional[str] = Form(None),
    language: Optional[str] = Form("en"),
):
    app_data = CitizenAppPayload(
        citizen_id=citizen_uid,
        latitude=latitude,
        longitude=longitude,
        category=category,
        description=description,
        constituency=constituency,
        language=language,
    )

    safe_filename = f"{int(time.time())}_{file.filename}"
    file_type = file.content_type
    file_bytes = await file.read()

    background_tasks.add_task(process_app_file, app_data, file_bytes, safe_filename, file_type)

    return {
        "status": "success",
        "message": "Media received and queued for AI processing",
        "file_tracked": safe_filename,
        "media_type": file_type,
    }


@router.post("/webhook", status_code=status.HTTP_202_ACCEPTED)
async def incoming_citizen_report(
    payload: CitizenReportIncoming,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(process_generic_webhook, payload)

    return {
        "status": "accepted",
        "message": "Report received and queued for processing.",
    }