from firebase_admin import auth
from app.core.logger import log


def get_or_create_citizen_uid(phone_number: str) -> str:
   
    try:
        user = auth.get_user_by_phone_number(phone_number)
        return user.uid
    except auth.UserNotFoundError:
        user = auth.create_user(phone_number=phone_number)
        log.info(f"Created new Firebase user for {phone_number}: {user.uid}")
        return user.uid