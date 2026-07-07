from twilio.rest import Client
from app.core.config import settings
from app.core.logger import log

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def send_otp(phone_number: str) -> bool:
    try:
        verification = client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID).verifications.create(
            to=phone_number, channel="sms"
        )
        log.info(f"Twilio OTP dispatched to {phone_number}, status={verification.status}")
        return True
    except Exception as e:
        log.error(f"Twilio OTP send failed for {phone_number}: {e}")
        return False


def verify_otp(phone_number: str, code: str) -> bool:
    
    try:
        check = client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID).verification_checks.create(
            to=phone_number, code=code
        )
        return check.status == "approved"
    except Exception as e:
        log.error(f"Twilio OTP verify failed for {phone_number}: {e}")
        return False