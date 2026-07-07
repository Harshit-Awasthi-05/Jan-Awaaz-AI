from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from firebase_admin import auth as firebase_auth
from app.core.security import verify_citizen_token, send_citizen_otp, verify_citizen_otp
from app.core.firebase import get_or_create_citizen_uid
from app.core.logger import log
from app.api.complaints.services import get_complaints_by_citizen

router = APIRouter(prefix="/citizen", tags=["Citizen Reporting"])


class PhoneOtpRequest(BaseModel):
    phone_number: str  # E.164 format, e.g. +919876543210
    is_signup: bool


class PhoneOtpVerify(BaseModel):
    phone_number: str
    otp: str
    name: Optional[str] = None


@router.post("/request-otp")
async def request_citizen_otp(payload: PhoneOtpRequest):
    try:
        user = firebase_auth.get_user_by_phone_number(payload.phone_number)
        user_exists = True
    except firebase_auth.UserNotFoundError:
        user_exists = False

    if payload.is_signup and user_exists:
        raise HTTPException(status_code=400, detail="User already exists. Please log in.")
    
    if not payload.is_signup and not user_exists:
        raise HTTPException(status_code=404, detail="User not found. Please sign up first.")

    success = send_citizen_otp(payload.phone_number)
    if not success:
        raise HTTPException(status_code=502, detail="Failed to send OTP. Please try again.")
    return {"status": "pending_verification", "message": "OTP sent to your phone number."}
   
   

@router.post("/verify-otp")
async def verify_citizen_otp_endpoint(payload: PhoneOtpVerify):
    if not verify_citizen_otp(payload.phone_number, payload.otp):
        raise HTTPException(status_code=401, detail="Invalid or expired OTP.")

    uid = get_or_create_citizen_uid(payload.phone_number)

    user_record = firebase_auth.get_user(uid)
    if payload.name and not user_record.display_name:
        firebase_auth.update_user(uid, display_name=payload.name)

    custom_token = firebase_auth.create_custom_token(uid).decode("utf-8")

    return {"status": "success", "custom_token": custom_token, "uid": uid}


@router.get("/complaints")
async def list_my_complaints(citizen_uid: str = Depends(verify_citizen_token)):
    complaints = get_complaints_by_citizen(citizen_uid)
    return {"citizen_uid": citizen_uid, "count": len(complaints), "complaints": complaints}