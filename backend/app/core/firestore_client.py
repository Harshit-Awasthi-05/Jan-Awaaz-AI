from google.cloud import firestore
from google.oauth2 import service_account
from app.core.config import settings

_db = None


def get_db() -> firestore.Client:
   
    global _db
    if _db is None:
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_APPLICATION_CREDENTIALS
        )
        _db = firestore.Client(credentials=credentials, project=credentials.project_id)
    return _db