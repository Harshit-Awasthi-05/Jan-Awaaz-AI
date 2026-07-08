import requests
from app.core.logger import log
from app.core.config import settings
from typing import Optional, Tuple

def normalize_phone_2factor(phone: str) -> str:
    """2factor expects 10 digits or country code. Let's send 10 digits to be safe or full with country code without +"""
    digits = "".join(filter(str.isdigit, phone))
    # If it has 91 prefix and is 12 digits, strip to 10 for standard Indian numbers.
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    return digits


def send_otp_2factor(phone_number: str) -> Tuple[bool, Optional[str]]:
    """
    Sends an OTP using 2factor.in
    Returns (success_boolean, session_id_or_none)
    """
    if not settings.TWOFACTOR_API_KEY:
        log.error("TWOFACTOR_API_KEY is not set.")
        return False, None

    normalized_phone = normalize_phone_2factor(phone_number)
    url = f"https://2factor.in/API/V1/{settings.TWOFACTOR_API_KEY}/SMS/{normalized_phone}/AUTOGEN/OTP1"

    try:
        response = requests.get(url, timeout=10)
        data = response.json()

        if data.get("Status") == "Success":
            session_id = data.get("Details")
            log.info(f"2Factor OTP sent successfully to {normalized_phone}. SessionID: {session_id}")
            return True, session_id
        else:
            log.error(f"Failed to send 2Factor OTP to {normalized_phone}: {data.get('Details')}")
            return False, None
    except Exception as e:
        log.error(f"Exception sending 2Factor OTP to {normalized_phone}: {e}")
        return False, None


def verify_otp_2factor(session_id: str, otp: str) -> bool:
    """
    Verifies an OTP using 2factor.in Session ID
    """
    if not settings.TWOFACTOR_API_KEY:
        log.error("TWOFACTOR_API_KEY is not set.")
        return False

    url = f"https://2factor.in/API/V1/{settings.TWOFACTOR_API_KEY}/SMS/VERIFY/{session_id}/{otp}"

    try:
        response = requests.get(url, timeout=10)
        data = response.json()

        if data.get("Status") == "Success":
            log.info(f"2Factor OTP verified successfully for SessionID: {session_id}")
            return True
        else:
            log.warning(f"2Factor OTP verification failed for SessionID: {session_id}. Reason: {data.get('Details')}")
            return False
    except Exception as e:
        log.error(f"Exception verifying 2Factor OTP for SessionID {session_id}: {e}")
        return False
