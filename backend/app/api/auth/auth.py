from fastapi import APIRouter
from pydantic import BaseModel
import random
from app.core.security import GOVT_DATABASE, verify_password, create_access_token, store_otp, check_otp
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

    otp = str(random.randint(100000, 999999))
    store_otp(request.email, otp)
    log.info(f"OTP {otp} generated for {request.email} (send via SMS in production)")

    return {"status": "pending_mfa", "message": f"OTP sent to {user['phone']}"}


@router.post("/verify-otp")
async def mp_verify_otp(request: OTPRequest):
    if not check_otp(request.email, request.otp):
        raise InvalidOTPException()

    user = GOVT_DATABASE.get(request.email)

    token_payload = {
        "sub": request.email,
        "name": user["name"],
        "constituency": user["constituency"],
        "role": "mp_official",
    }

    access_token = create_access_token(data=token_payload)

    return {"status": "success", "access_token": access_token, "token_type": "bearer"}