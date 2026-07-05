from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_mp
from app.core.bigquery_client import get_bq_client
from app.core.logger import log

router = APIRouter(prefix="/mp", tags=["MP Dashboard"])

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
        return {
            "requested_by": mp.get("name"),
            "count": len(rankings),
            "rankings": rankings,
        }
    except Exception as e:
        log.error(f"Priority ranking query failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to compute priority rankings.")