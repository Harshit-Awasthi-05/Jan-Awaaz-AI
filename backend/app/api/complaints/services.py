import uuid
from datetime import datetime, timezone
from typing import Optional
from app.core.firestore_client import get_db
from app.core.bigquery_client import get_bq_client
from app.core.logger import log


def create_complaint(
    citizen_uid: str,
    channel: str,  # "app" or "whatsapp"
    category: Optional[str],
    severity: Optional[str],
    summary: Optional[str],
    action_insight: Optional[str],
    media_url: Optional[str],
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    constituency: Optional[str] = "Central District",  # hardcoded for now, see note below
) -> str:
    """
    Writes one complaint to both Firestore (operational: citizen-facing
    "my complaints" screen) and BigQuery (analytical: MP priority ranking,
    joins against demographic data). Firestore write is authoritative;
    if the BigQuery insert fails, we log it but don't fail the request,
    since the citizen's report is still safely saved.
    """
    db = get_db()
    complaint_id = str(uuid.uuid4())[:8]
    created_at = datetime.now(timezone.utc)

    doc = {
        "complaint_id": complaint_id,
        "citizen_uid": citizen_uid,
        "channel": channel,
        "category": category,
        "severity": severity,
        "summary": summary,
        "action_insight": action_insight,
        "media_url": media_url,
        "latitude": latitude,
        "longitude": longitude,
        "status": "submitted",
        "created_at": created_at,
    }

    db.collection("complaints").document(complaint_id).set(doc)
    log.info(f"Complaint {complaint_id} saved to Firestore for citizen {citizen_uid} via {channel}")

    try:
        bq_client = get_bq_client()
        table_id = f"{bq_client.project}.janawaaz.citizen_reports"
        row = {
            "complaint_id": complaint_id,
            "citizen_uid": citizen_uid,
            "channel": channel,
            "category": category,
            "severity": severity,
            "summary": summary,
            "media_url": media_url,
            "latitude": latitude,
            "longitude": longitude,
            "constituency": constituency,
            "status": "submitted",
            "created_at": created_at.isoformat(),
        }
        
        from google.cloud import bigquery
        job_config = bigquery.LoadJobConfig(
            write_disposition="WRITE_APPEND",
            source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
        )
        load_job = bq_client.load_table_from_json([row], table_id, job_config=job_config)
        load_job.result()
        log.info(f"Complaint {complaint_id} also synced to BigQuery")
    except Exception as e:
        log.error(f"BigQuery insert failed for {complaint_id}: {e}")

    return complaint_id


def get_complaints_by_citizen(citizen_uid: str) -> list[dict]:
    db = get_db()
    query = (
        db.collection("complaints")
        .where("citizen_uid", "==", citizen_uid)
        .order_by("created_at", direction="DESCENDING")
    )
    return [doc.to_dict() for doc in query.stream()]