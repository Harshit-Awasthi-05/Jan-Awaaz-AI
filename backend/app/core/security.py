from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from app.core.config import settings
from firebase_admin import auth
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_scheme = HTTPBearer()

OTP_TTL_MINUTES = 5
OTP_MAX_ATTEMPTS = 5

# otp_storage[email] = {"otp": "123456", "expires_at": datetime, "attempts": 0}
otp_storage: dict = {}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


GOVT_DATABASE = {
    "mp@janawaaz.in": {
        "name": "Honorable MP",
        "constituency": "Central District",
        "phone": "+919876543210",
        "password_hash": get_password_hash("hackathon2026"),
    }
}


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
    """Returns True if valid. Deletes the OTP record on success or exhausted attempts."""
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
    """
    Decodes and verifies the JWT issued by /mp/verify-otp.
    Use this as a Depends() on any route that should be MP-only
    (e.g. viewing constituency complaint dashboards).
    """
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