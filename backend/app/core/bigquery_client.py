from google.cloud import bigquery
from google.oauth2 import service_account
from app.core.config import settings

_bq_client = None


def get_bq_client() -> bigquery.Client:
    global _bq_client
    if _bq_client is None:
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_APPLICATION_CREDENTIALS
        )
        _bq_client = bigquery.Client(credentials=credentials, project=credentials.project_id)
    return _bq_client