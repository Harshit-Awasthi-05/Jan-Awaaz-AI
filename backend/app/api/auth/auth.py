from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.security import verify_password, create_access_token
from app.core.twilio_service import send_otp, verify_otp
from app.core.firestore_client import get_db
from app.core.exceptions import InvalidCredentialsException, InvalidOTPException
from app.core.logger import log

router = APIRouter(prefix="/mp", tags=["MP Authentication"])


class LoginRequest(BaseModel):
    email: str
    constituency: str
    phone: str
    password: str


class OTPRequest(BaseModel):
    email: str
    otp: str


def _normalize_phone(phone: str) -> str:
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("+"):
        return phone
    if phone.startswith("91") and len(phone) == 12:
        return f"+{phone}"
    if len(phone) == 10:
        return f"+91{phone}"
    return phone


@router.post("/login")
async def mp_login(request: LoginRequest):
    db = get_db()
    docs = db.collection("mp_users").where("email", "==", request.email).limit(1).stream()
    user = None
    for doc in docs:
        user = doc.to_dict()
        break

    if (
        not user
        or user.get("constituency") != request.constituency
        or _normalize_phone(user.get("phone", "")) != _normalize_phone(request.phone)
        or not verify_password(request.password, user.get("password_hash", ""))
    ):
        raise InvalidCredentialsException()

    # Send real SMS OTP via Twilio Verify to the phone number the MP entered
    phone = _normalize_phone(request.phone)
    success = send_otp(phone)
    if not success:
        log.error(f"Failed to send real SMS OTP to {phone}")
        raise HTTPException(
            status_code=500,
            detail=f"Twilio failed to send SMS to {phone}. Please check the phone number and try again."
        )

    log.info(f"Twilio Verify OTP dispatched to {phone} for {request.email}")

    return {"status": "pending_mfa", "message": f"OTP sent to {phone}"}


@router.post("/verify-otp")
async def mp_verify_otp(request: OTPRequest):
    db = get_db()
    docs = db.collection("mp_users").where("email", "==", request.email).limit(1).stream()
    user = None
    for doc in docs:
        user = doc.to_dict()
        break
        
    if not user:
        raise InvalidOTPException()

    # Verify real SMS OTP via Twilio Verify (must match the number the OTP was sent to)
    if not verify_otp(_normalize_phone(user.get("phone", "")), request.otp):
        raise InvalidOTPException()

    token_payload = {
        "sub": request.email,
        "name": user.get("name"),
        "constituency": user.get("constituency"),
        "role": "mp_official",
    }

    access_token = create_access_token(data=token_payload)

    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "mp_name": user.get("name"),
        "mp_email": request.email,
        "mp_constituency": user.get("constituency"),
        "mp_phone": user.get("phone", ""),
    }