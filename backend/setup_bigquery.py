
import os
from dotenv import load_dotenv
from google.cloud import bigquery
from google.oauth2 import service_account

load_dotenv()

credentials = service_account.Credentials.from_service_account_file(
    os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
)
client = bigquery.Client(credentials=credentials, project=credentials.project_id)

DATASET_ID = "janawaaz"

# 1. Create dataset
dataset_ref = f"{client.project}.{DATASET_ID}"
dataset = bigquery.Dataset(dataset_ref)
dataset.location = "asia-south1"
client.create_dataset(dataset, exists_ok=True)
print(f"Dataset ready: {dataset_ref}")


reports_schema = [
    bigquery.SchemaField("complaint_id", "STRING"),
    bigquery.SchemaField("citizen_uid", "STRING"),
    bigquery.SchemaField("channel", "STRING"),
    bigquery.SchemaField("category", "STRING"),
    bigquery.SchemaField("severity", "STRING"),
    bigquery.SchemaField("summary", "STRING"),
    bigquery.SchemaField("media_url", "STRING"),
    bigquery.SchemaField("latitude", "FLOAT"),
    bigquery.SchemaField("longitude", "FLOAT"),
    bigquery.SchemaField("constituency", "STRING"),
    bigquery.SchemaField("status", "STRING"),
    bigquery.SchemaField("created_at", "TIMESTAMP"),
]
reports_table_ref = f"{dataset_ref}.citizen_reports"
reports_table = bigquery.Table(reports_table_ref, schema=reports_schema)
client.create_table(reports_table, exists_ok=True)
print(f"Table ready: {reports_table_ref}")


demo_schema = [
    bigquery.SchemaField("constituency", "STRING"),
    bigquery.SchemaField("population", "INTEGER"),
    bigquery.SchemaField("literacy_rate", "FLOAT"),
    bigquery.SchemaField("infra_score", "FLOAT"),  
    bigquery.SchemaField("center_lat", "FLOAT"),
    bigquery.SchemaField("center_lng", "FLOAT"),
]
demo_table_ref = f"{dataset_ref}.constituency_demographics"
demo_table = bigquery.Table(demo_table_ref, schema=demo_schema)
client.create_table(demo_table, exists_ok=True)
print(f"Table ready: {demo_table_ref}")


mock_rows = [
    {
        "constituency": "Central District",
        "population": 450000,
        "literacy_rate": 0.72,
        "infra_score": 0.4,
        "center_lat": 28.6139,
        "center_lng": 77.2090,
    },
]
job_config = bigquery.LoadJobConfig(
    schema=demo_schema,
    write_disposition="WRITE_APPEND",
    source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
)
load_job = client.load_table_from_json(mock_rows, demo_table_ref, job_config=job_config)
load_job.result()  # waits for the job to finish
print("Mock demographic data inserted (via load job).")