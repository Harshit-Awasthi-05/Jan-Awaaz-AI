from fastapi import APIRouter, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from app.core.exceptions import InvalidDeviceFingerprintException

router = APIRouter(prefix="/api/v1/citizen", tags=["Citizen Reporting"])
security = HTTPBearer()

def verify_citizen_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token.get("uid")
    except Exception:
        raise InvalidDeviceFingerprintException()

@router.post("/report")
async def submit_report(payload: dict, citizen_uid: str = Depends(verify_citizen_token)):
    return {"status": "202 Accepted", "message": "Report queued successfully."}