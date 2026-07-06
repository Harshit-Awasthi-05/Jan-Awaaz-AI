from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import random
from firebase_admin import auth as firebase_auth
from app.core.security import verify_citizen_token, store_otp, check_otp
from app.core.firebase import get_or_create_citizen_uid
from app.core.logger import log
from app.api.complaints.services import get_complaints_by_citizen

router = APIRouter(prefix="/citizen", tags=["Citizen Reporting"])


class PhoneOtpRequest(BaseModel):
    phone_number: str  # E.164 format, e.g. +919876543210


class PhoneOtpVerify(BaseModel):
    phone_number: str
    otp: str
    name: Optional[str] = None


@router.post("/request-otp")
async def request_citizen_otp(payload: PhoneOtpRequest):
   
    otp = str(random.randint(100000, 999999))
    store_otp(payload.phone_number, otp)
    log.info(f"Citizen OTP {otp} generated for {payload.phone_number}")
    return {"status": "pending_verification", "message": "OTP generated (check server logs for demo)."}


@router.post("/verify-otp")
async def verify_citizen_otp(payload: PhoneOtpVerify):
    if not check_otp(payload.phone_number, payload.otp):
        raise HTTPException(status_code=401, detail="Invalid or expired OTP.")

    uid = get_or_create_citizen_uid(payload.phone_number)

    if payload.name:
        firebase_auth.update_user(uid, display_name=payload.name)

    custom_token = firebase_auth.create_custom_token(uid).decode("utf-8")

    return {"status": "success", "custom_token": custom_token, "uid": uid}


@router.get("/complaints")
async def list_my_complaints(citizen_uid: str = Depends(verify_citizen_token)):
    complaints = get_complaints_by_citizen(citizen_uid)
    return {"citizen_uid": citizen_uid, "count": len(complaints), "complaints": complaints}