from fastapi import APIRouter, Depends
from app.core.security import verify_citizen_token
from app.api.complaints.services import get_complaints_by_citizen

router = APIRouter(prefix="/citizen", tags=["Citizen Reporting"])


@router.post("/report")
async def submit_report(payload: dict, citizen_uid: str = Depends(verify_citizen_token)):
    return {"status": "202 Accepted", "message": "Report queued successfully."}


@router.get("/complaints")
async def list_my_complaints(citizen_uid: str = Depends(verify_citizen_token)):
    complaints = get_complaints_by_citizen(citizen_uid)
    return {"citizen_uid": citizen_uid, "count": len(complaints), "complaints": complaints}