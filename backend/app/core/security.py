from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from app.core.config import settings
from app.core.logger import log
from firebase_admin import auth
import os
from dotenv import load_dotenv
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from twilio.rest import Client as TwilioClient

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_scheme = HTTPBearer()


_twilio_client = TwilioClient(
    settings.TWILIO_ACCOUNT_SID,
    settings.TWILIO_AUTH_TOKEN,
)


OTP_TTL_MINUTES = 5
OTP_MAX_ATTEMPTS = 5

otp_storage: dict = {}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)





def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def store_otp(email: str, otp: str) -> None:
    otp_storage[email] = {
        "otp": otp,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES),
        "attempts": 0,
    }


def check_otp(email: str, submitted_otp: str) -> bool:
    record = otp_storage.get(email)
    if not record:
        return False

    if datetime.now(timezone.utc) > record["expires_at"]:
        del otp_storage[email]
        return False

    record["attempts"] += 1
    if record["attempts"] > OTP_MAX_ATTEMPTS:
        del otp_storage[email]
        return False

    if record["otp"] != submitted_otp:
        return False

    del otp_storage[email]
    return True


def send_citizen_otp(phone_number: str) -> bool:
    try:
        verification = (
            _twilio_client.verify.v2
            .services(settings.TWILIO_VERIFY_SERVICE_SID)
            .verifications.create(to=phone_number, channel="sms")
        )
        log.info(
            f"Twilio OTP dispatched to {phone_number}, status={verification.status}"
        )
        return verification.status == "pending"
    except Exception as e:
        log.error(f"Twilio OTP send failed for {phone_number}: {e}")
        return False


def verify_citizen_otp(phone_number: str, code: str) -> bool:
    try:
        check = (
            _twilio_client.verify.v2
            .services(settings.TWILIO_VERIFY_SERVICE_SID)
            .verification_checks.create(to=phone_number, code=code)
        )
        approved = check.status == "approved"
        log.info(
            f"Twilio OTP verify for {phone_number}: status={check.status}"
        )
        return approved
    except Exception as e:
        log.error(f"Twilio OTP verify failed for {phone_number}: {e}")
        return False


async def verify_citizen_token(
    authorization: HTTPAuthorizationCredentials = Security(security_scheme),
) -> str:
    id_token = authorization.credentials
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token.get("uid")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {str(e)}")


async def get_current_mp(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    if payload.get("role") != "mp_official":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is restricted to MP officials.",
        )

    return payload