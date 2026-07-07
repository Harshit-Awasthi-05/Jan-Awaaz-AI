import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Literal
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from firebase_admin import auth as firebase_auth
from app.core.security import get_current_mp
from app.core.bigquery_client import get_bq_client
from app.core.firestore_client import get_db
from app.core.logger import log

router = APIRouter(prefix="/mp", tags=["MP Dashboard"])


@router.get("/info")
async def get_mp_info():
    return {
        "mp_name": os.environ.get("MP_NAME", "Jan Awaaz MP"),
        "constituency": os.environ.get("MP_CONSTITUENCY", "Jan Awaaz Constituency"),
    }

PRIORITY_QUERY = """
SELECT
  r.constituency,
  COUNT(r.complaint_id) AS total_reports,
  ROUND(AVG(
    CASE r.severity
      WHEN 'Critical' THEN 4
      WHEN 'High' THEN 3
      WHEN 'Medium' THEN 2
      ELSE 1
    END
  ), 2) AS avg_severity_score,
  COALESCE(d.infra_score, 0.5) AS infra_score,
  d.population AS population,
  ROUND(
    (COUNT(r.complaint_id) * 0.4)
    + (AVG(
        CASE r.severity
          WHEN 'Critical' THEN 4
          WHEN 'High' THEN 3
          WHEN 'Medium' THEN 2
          ELSE 1
        END
      ) * 0.4)
    + ((1 - COALESCE(d.infra_score, 0.5)) * 0.2),
    2
  ) AS mp_priority_score
FROM `{project}.janawaaz.citizen_reports` r
LEFT JOIN `{project}.janawaaz.constituency_demographics` d
  ON r.constituency = d.constituency
GROUP BY r.constituency, d.infra_score, d.population
ORDER BY mp_priority_score DESC
"""


@router.get("/dashboard/priority")
async def get_priority_rankings(mp: dict = Depends(get_current_mp)):
    try:
        client = get_bq_client()
        query = PRIORITY_QUERY.format(project=client.project)
        results = client.query(query).result()
        rankings = [dict(row) for row in results]
        return {"requested_by": mp.get("name"), "count": len(rankings), "rankings": rankings}
    except Exception as e:
        log.error(f"Priority ranking query failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to compute priority rankings.")


def _resolve_citizen_name(citizen_uid: str) -> str:
    try:
        user = firebase_auth.get_user(citizen_uid)
        return user.display_name or f"Citizen {citizen_uid[:6]}"
    except Exception:
        return f"Citizen {citizen_uid[:6]}"


@router.get("/dashboard/complaints")
async def list_all_complaints(mp: dict = Depends(get_current_mp)):
    db = get_db()
    docs = db.collection("complaints").order_by("created_at", direction="DESCENDING").stream()
    complaints = []
    for doc in docs:
        data = doc.to_dict()
        data["citizen_name"] = _resolve_citizen_name(data.get("citizen_uid", ""))
        complaints.append(data)
    return {"count": len(complaints), "complaints": complaints}


@router.get("/dashboard/constituents")
async def list_constituents(mp: dict = Depends(get_current_mp)):
    db = get_db()
    docs = db.collection("complaints").stream()

    by_citizen: dict = {}
    for doc in docs:
        data = doc.to_dict()
        uid = data.get("citizen_uid")
        if not uid:
            continue

        created_at = data.get("created_at")
        entry = by_citizen.setdefault(
            uid, {"citizen_uid": uid, "grievance_count": 0, "last_active": None}
        )
        entry["grievance_count"] += 1

        if created_at and (entry["last_active"] is None or created_at > entry["last_active"]):
            entry["last_active"] = created_at

    constituents = []
    for uid, entry in by_citizen.items():
        try:
            user = firebase_auth.get_user(uid)
            name = user.display_name or f"Citizen {uid[:6]}"
            phone = user.phone_number or "—"
        except Exception:
            name = f"Citizen {uid[:6]}"
            phone = "—"

        last_active = entry["last_active"]
        constituents.append({
            "citizen_uid": uid,
            "name": name,
            "constituency": mp.get("constituency"),
            "phone": phone,
            "grievance_count": entry["grievance_count"],
            "last_active": last_active.isoformat() if hasattr(last_active, "isoformat") else last_active,
        })

    constituents.sort(key=lambda c: c["grievance_count"], reverse=True)
    return {"count": len(constituents), "constituents": constituents}


class StatusUpdate(BaseModel):
    status: Literal["submitted", "in_progress", "resolved"]


@router.patch("/complaints/{complaint_id}/status")
async def update_complaint_status(
    complaint_id: str, payload: StatusUpdate, mp: dict = Depends(get_current_mp)
):
    db = get_db()
    doc_ref = db.collection("complaints").document(complaint_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Complaint not found.")
    doc_ref.update({"status": payload.status})
    log.info(f"Complaint {complaint_id} status updated to '{payload.status}' by {mp.get('email')}")
    return {"complaint_id": complaint_id, "status": payload.status}




def _severity_score(severity: str) -> int:
    return {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}.get(severity, 1)


@router.get("/dashboard/overview")
async def get_dashboard_overview(mp: dict = Depends(get_current_mp)):

    db = get_db()
    docs = list(db.collection("complaints").stream())
    complaints = [doc.to_dict() for doc in docs]

    total = len(complaints)
    resolved_count = sum(1 for c in complaints if c.get("status") == "resolved")
    active_citizens = len({c.get("citizen_uid") for c in complaints if c.get("citizen_uid")})

    category_counts = defaultdict(int)
    for c in complaints:
        category_counts[c.get("category") or "Uncategorized"] += 1
    category_breakdown = [
        {
            "name": name,
            "count": count,
            "pct": round((count / total) * 100) if total else 0,
        }
        for name, count in sorted(category_counts.items(), key=lambda x: -x[1])
    ]

    status_counts = defaultdict(int)
    for c in complaints:
        status_counts[c.get("status") or "submitted"] += 1
    status_distribution = [{"name": k, "value": v} for k, v in status_counts.items()]

    today = datetime.now(timezone.utc).date()
    day_buckets = {(today - timedelta(days=i)): {"filed": 0, "resolved": 0} for i in range(6, -1, -1)}

    for c in complaints:
        created_at = c.get("created_at")
        if not created_at:
            continue
        if hasattr(created_at, "date"):
            c_date = created_at.date()
        else:
            try:
                c_date = datetime.fromisoformat(str(created_at)).date()
            except ValueError:
                continue
        if c_date in day_buckets:
            day_buckets[c_date]["filed"] += 1
            if c.get("status") == "resolved":
                day_buckets[c_date]["resolved"] += 1

    weekly_activity = [
        {"name": d.strftime("%a"), "filed": v["filed"], "resolved": v["resolved"]}
        for d, v in day_buckets.items()
    ]

    
    insights = []
    if total == 0:
        insights.append("No reports yet — insights will appear once citizens start filing grievances.")
    else:
        top_category = category_breakdown[0]
        insights.append(
            f"Most reported category: {top_category['name']} "
            f"({top_category['count']} report{'s' if top_category['count'] != 1 else ''}, "
            f"{top_category['pct']}% of total)."
        )

        high_severity_count = sum(
            1 for c in complaints if c.get("severity") in ("High", "Critical")
        )
        if high_severity_count > 0:
            pct = round((high_severity_count / total) * 100)
            insights.append(
                f"{high_severity_count} report{'s' if high_severity_count != 1 else ''} "
                f"({pct}%) are High or Critical severity and may need urgent attention."
            )

        if resolved_count > 0:
            insights.append(
                f"{resolved_count} of {total} reports have been marked resolved so far."
            )
        else:
            insights.append("No reports have been marked resolved yet.")

    return {
        "total_grievances": total,
        "active_citizens": active_citizens,
        "resolved_count": resolved_count,
        "category_breakdown": category_breakdown,
        "status_distribution": status_distribution,
        "weekly_activity": weekly_activity,
        "ai_insights": insights,
    }