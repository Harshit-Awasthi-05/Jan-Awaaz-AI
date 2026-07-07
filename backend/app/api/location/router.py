from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.constituency_locator import resolve_constituency_from_coords
from app.core.logger import log

router = APIRouter(prefix="/location", tags=["Location"])


class CoordsRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


@router.post("/resolve-constituency")
async def resolve_constituency(payload: CoordsRequest):

    result = await resolve_constituency_from_coords(payload.latitude, payload.longitude)
    if not result.get("resolved"):
        log.info(
            f"Could not confidently resolve constituency for "
            f"({payload.latitude}, {payload.longitude}): {result.get('reason')}"
        )
    return result