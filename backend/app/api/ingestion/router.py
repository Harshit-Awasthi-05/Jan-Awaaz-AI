from fastapi import APIRouter, BackgroundTasks, status, UploadFile, File, Form, Depends
from typing import Optional
import time
from app.api.ingestion.schemas import CitizenReportIncoming, WhatsAppWebhookPayload, CitizenAppPayload
from app.api.ingestion.media_utils import CloudinaryManager
from app.core.security import verify_citizen_token
from app.core.logger import log
from app.core.ai_service import analyze_citizen_report
from app.api.complaints.services import create_complaint

router = APIRouter(prefix="/ingestion", tags=["Ingestion Layer"])
media_manager = CloudinaryManager()

async def process_app_file(app_data: CitizenAppPayload, file_bytes: bytes, filename: str, content_type: str):
    log.info(f"App Upload received from Firebase UID: {app_data.citizen_id}")
    log.info(f"File Type: {content_type}")
    log.info(f"Location: Lat {app_data.latitude}, Lng {app_data.longitude}")
    log.info(f"Saved File Tracking: {filename}")
    
    public_url = await media_manager.upload_media(file_bytes=file_bytes, filename=filename)
    log.info(f"Media secured at: {public_url}")
    
    log.info("Triggering Gemini AI Analysis...")
    ai_insights = analyze_citizen_report(
        text_content=app_data.description, 
        file_bytes=file_bytes,
        language=app_data.language
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
        constituency=app_data.constituency
    )
    
    log.info(f"Complaint saved with ID: {complaint_id}")

async def process_whatsapp_media(payload: WhatsAppWebhookPayload):
    log.info(f"WhatsApp {payload.message_type} received from {payload.from_number}")
    if payload.media_url:
        log.info(f"URL to download: {payload.media_url}")
    log.info("Ready for AI Processing.")

async def process_generic_webhook(payload: CitizenReportIncoming):
    log.info(f"Generic webhook received for user: {payload.user_id}")
    if payload.media_url:
        log.info(f"Media URL to process: {payload.media_url}")
    log.info("Ready for AI Processing.")

@router.post("/whatsapp")
async def whatsapp_webhook(payload: WhatsAppWebhookPayload, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_whatsapp_media, payload)
    return {"status": "received"}

@router.post("/app-upload")
async def app_media_upload(
    background_tasks: BackgroundTasks,
    citizen_uid: str = Depends(verify_citizen_token),
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    constituency: Optional[str] = Form("Central District"),
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
        "media_type": file_type
    }

@router.post("/webhook", status_code=status.HTTP_202_ACCEPTED)
async def incoming_citizen_report(
    payload: CitizenReportIncoming,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(process_generic_webhook, payload)
    
    return {
        "status": "accepted", 
        "message": "Report received and queued for processing."
    }