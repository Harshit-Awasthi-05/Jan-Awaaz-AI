from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from firebase_admin import auth as firebase_auth
from app.core.security import verify_citizen_token, send_citizen_otp, verify_citizen_otp
from app.core.firebase import get_or_create_citizen_uid
from app.core.logger import log
from app.api.complaints.services import get_complaints_by_citizen

router = APIRouter(prefix="/citizen", tags=["Citizen Reporting"])


class SyncProfileRequest(BaseModel):
    name: str

@router.post("/sync-profile")
async def sync_citizen_profile(
    payload: SyncProfileRequest,
    citizen_uid: str = Depends(verify_citizen_token)
):
    try:
        user_record = firebase_auth.get_user(citizen_uid)
        if payload.name and not user_record.display_name:
            firebase_auth.update_user(citizen_uid, display_name=payload.name)
        return {"status": "success", "message": "Profile synced successfully"}
    except Exception as e:
        log.error(f"Failed to sync profile for {citizen_uid}: {e}")
        raise HTTPException(status_code=500, detail="Failed to sync profile.")


@router.get("/complaints")
async def list_my_complaints(citizen_uid: str = Depends(verify_citizen_token)):
    complaints = get_complaints_by_citizen(citizen_uid)
    return {"citizen_uid": citizen_uid, "count": len(complaints), "complaints": complaints}