from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from app.core.config import settings
from firebase_admin import auth
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

security_scheme = HTTPBearer()

otp_storage = {}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

GOVT_DATABASE = {
    "mp@janawaaz.in": {
        "name": "Honorable MP",
        "constituency": "Central District",
        "phone": "+919876543210",
        "password_hash": get_password_hash("hackathon2026")
    }
}

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def verify_citizen_token(authorization: HTTPAuthorizationCredentials = Security(security_scheme)):
    id_token = authorization.credentials
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token.get("uid")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {str(e)}")