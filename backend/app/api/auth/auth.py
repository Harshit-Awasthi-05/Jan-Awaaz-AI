from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.security import GOVT_DATABASE, verify_password, create_access_token
from app.core.twilio_service import send_otp, verify_otp
from app.core.exceptions import InvalidCredentialsException, InvalidOTPException
from app.core.logger import log

router = APIRouter(prefix="/mp", tags=["MP Authentication"])


class LoginRequest(BaseModel):
    email: str
    constituency: str
    password: str


class OTPRequest(BaseModel):
    email: str
    otp: str


@router.post("/login")
async def mp_login(request: LoginRequest):
    user = GOVT_DATABASE.get(request.email)

    if not user or user["constituency"] != request.constituency or not verify_password(
        request.password, user["password_hash"]
    ):
        raise InvalidCredentialsException()

    # Send real SMS OTP via Twilio Verify
    success = send_otp(user["phone"])
    if not success:
        log.error(f"Failed to send real SMS OTP to {user['phone']}")
        raise HTTPException(
            status_code=500, 
            detail=f"Twilio failed to send SMS to {user['phone']}. Please update MP_PHONE in your .env file."
        )

    log.info(f"Twilio Verify OTP dispatched to {user['phone']} for {request.email}")

    return {"status": "pending_mfa", "message": f"OTP sent to {user['phone']}"}


@router.post("/verify-otp")
async def mp_verify_otp(request: OTPRequest):
    user = GOVT_DATABASE.get(request.email)
    if not user:
        raise InvalidOTPException()

    # Verify real SMS OTP via Twilio Verify
    if not verify_otp(user["phone"], request.otp):
        raise InvalidOTPException()

    token_payload = {
        "sub": request.email,
        "name": user["name"],
        "constituency": user["constituency"],
        "role": "mp_official",
    }

    access_token = create_access_token(data=token_payload)

    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "mp_name": user["name"],
        "mp_email": request.email,
        "mp_constituency": user["constituency"],
        "mp_phone": user.get("phone", ""),
    }