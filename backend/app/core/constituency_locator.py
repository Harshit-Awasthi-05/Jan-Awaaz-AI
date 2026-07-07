

import json
import re
from difflib import SequenceMatcher
from pathlib import Path

import httpx

from app.core.logger import log

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "mps.json"

with open(_DATA_PATH, "r", encoding="utf-8") as f:
    _MPS = json.load(f)


_STATE_ALIASES = {
    "delhi": "NCT of Delhi",
    "orissa": "Odisha",
    "pondicherry": "Puducherry",
    "uttaranchal": "Uttarakhand",
    "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
    "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
}

NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"

_HEADERS = {"User-Agent": "JanAwaazAI/1.0 (civic grievance platform)"}


def _clean(s: str) -> str:
    return re.sub(r"\s*\([^)]*\)", "", s or "").strip().lower()


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, _clean(a), _clean(b)).ratio()


def _normalize_state(raw_state: str) -> str:
    key = (raw_state or "").strip().lower()
    return _STATE_ALIASES.get(key, raw_state)


async def reverse_geocode(latitude: float, longitude: float) -> dict:
    """Reverse-geocode coordinates to an address via Nominatim."""
    params = {
        "format": "jsonv2",
        "lat": latitude,
        "lon": longitude,
        "addressdetails": 1,
        "zoom": 12,  # city/district level, not house-level
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(NOMINATIM_URL, params=params, headers=_HEADERS)
        resp.raise_for_status()
        return resp.json()


def _candidate_area_names(address: dict) -> list[str]:
    """Pull out every address field that could plausibly resemble a
    constituency name, in priority order (most specific first)."""
    fields = [
        "city",
        "town",
        "municipality",
        "county",
        "state_district",
        "city_district",
        "suburb",
        "district",
    ]
    return [address[f] for f in fields if address.get(f)]


def match_constituency(address: dict) -> dict | None:
  
    raw_state = address.get("state", "")
    state = _normalize_state(raw_state)

    candidates = [m for m in _MPS if m["state"].lower() == state.lower()]
    if not candidates:
        
        return None

    area_names = _candidate_area_names(address)
    if not area_names:
        return None

    best = None
    best_score = 0.0
    for mp in candidates:
        for area in area_names:
            score = _similarity(mp["constituency"], area)
            if score > best_score:
                best_score = score
                best = mp

    if best is None or best_score < 0.45:
        return None

    return {**best, "confidence": round(best_score, 2)}


async def resolve_constituency_from_coords(latitude: float, longitude: float) -> dict:
    """Full pipeline: coords -> address -> constituency match."""
    try:
        geo = await reverse_geocode(latitude, longitude)
    except Exception as e:
        log.error(f"Reverse geocoding failed for ({latitude}, {longitude}): {e}")
        return {"resolved": False, "reason": "geocoding_failed"}

    address = geo.get("address", {})
    match = match_constituency(address)

    if not match:
        return {
            "resolved": False,
            "reason": "no_confident_match",
            "detected_state": _normalize_state(address.get("state", "")),
            "detected_area": _candidate_area_names(address)[:1] or None,
        }

    return {
        "resolved": True,
        "constituency": match["constituency"],
        "state": match["state"],
        "mp_name": match["mp_name"],
        "party": match["party"],
        "confidence": match["confidence"],
    }