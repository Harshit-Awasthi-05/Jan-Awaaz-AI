# Jan Awaaz AI

[![Python Version](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/backend-FastAPI-teal.svg)](https://fastapi.tiangolo.com/)
[![Build Tool](https://img.shields.io/badge/frontend-vite-blueviolet.svg)](https://vitejs.dev/)
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange.svg)](https://ai.google.dev/)

An AI-powered citizen grievance reporting and constituency development
planning platform. Citizens report local issues — road damage, water supply,
sanitation, and more — via a mobile-friendly web app, attaching a photo and
description. Gemini analyzes each report to extract its category, severity,
and a concrete actionable insight for officials. MPs get a real-time
dashboard with analytics and a data-driven priority-ranking model that
combines report volume and severity with constituency demographics, so the
highest-need development works surface first.

## Architecture Overview

The platform is a decoupled web application with a FastAPI backend and a
React frontend. Citizen identity and real-time complaint storage run on
Firebase/Firestore, aggregate analytics run on BigQuery, and media (photos
attached to reports) is stored on Cloudinary. Gemini powers the AI analysis
step that turns a raw citizen report into a structured, actionable record.

```mermaid
graph TD
    Client["Frontend (React / Vite)"] -->|HTTPS| API["FastAPI Backend (Uvicorn)"]
    API -->|firebase-admin| Auth["Firebase Authentication"]
    API -->|google-cloud-firestore| Firestore["Firestore (live complaint records)"]
    API -->|google-cloud-bigquery| BQ["BigQuery (priority-ranking analytics)"]
    API -->|cloudinary SDK| Media["Cloudinary (photo/media storage)"]
    API -->|google-generativeai| Gemini["Gemini 2.5 Flash (report analysis)"]
```

## Key Features

- **AI Report Analysis**: Every citizen submission (photo + description) is analyzed by Gemini in a single multimodal call, extracting `category`, `severity`, a one-sentence `summary`, and an `actionable_insight` for the responsible official — with a safe fallback if the model call fails.
- **MP Priority Ranking**: A BigQuery query combines report volume, severity-weighted scoring, and constituency infrastructure/population data into a single `mp_priority_score`, ranking constituencies by real, computed need rather than manual triage.
- **Real-Time MP Dashboard**: Category breakdowns, status distribution, weekly activity, and AI-generated insights are all computed live from Firestore complaint documents — no fabricated metrics or placeholder trend lines.
- **Constituent Directory**: Citizens who have filed at least one grievance are aggregated with real grievance counts and last-active dates, cross-referenced against Firebase Auth user records.
- **Phone-Based Citizen Auth**: A custom OTP flow (phone number → OTP → Firebase custom token) so citizens can sign in without a password.
- **Status Tracking**: Citizens can track the live status (`submitted` → `in_progress` → `resolved`) of every report they've filed.

## Tech Stack

| Component        | Technology                          | Description                                                        |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------- |
| Frontend          | React, Vite, React Router            | Component-based citizen app and MP admin dashboard                   |
| Styling           | Tailwind CSS                         | Utility-first styling for both citizen and admin layouts              |
| Charts            | Recharts                             | Category breakdown, status distribution, and weekly activity charts   |
| Backend           | FastAPI, Uvicorn                     | Async Python API framework                                            |
| Auth              | Firebase Authentication              | Custom-token citizen auth + JWT-based MP official auth                |
| Database          | Firestore                            | Live complaint records, read/written per-request                      |
| Analytics         | BigQuery                             | `citizen_reports` + `constituency_demographics` priority-ranking query |
| Media Storage     | Cloudinary                           | Citizen-uploaded photos/media for each report                         |
| AI                | Google Generative AI (Gemini 2.5 Flash) | Multimodal report analysis (text + image)                          |
| Security          | PyJWT, Passlib (bcrypt)              | MP session tokens and password hashing                                |

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/            # MP login + OTP verification (JWT issuance)
│   │   │   ├── citizen/         # Citizen OTP auth + "my complaints" endpoint
│   │   │   ├── complaints/      # Shared complaint create/read services (Firestore + BigQuery)
│   │   │   ├── ingestion/       # Report intake: app uploads, WhatsApp webhook, generic webhook
│   │   │   └── mp/              # MP dashboard: overview, complaints list, constituents, priority ranking
│   │   ├── core/
│   │   │   ├── ai_service.py        # Gemini multimodal report analysis
│   │   │   ├── bigquery_client.py   # BigQuery client singleton
│   │   │   ├── firebase.py          # Firebase Auth helpers (get-or-create citizen UID)
│   │   │   ├── firestore_client.py  # Firestore client singleton
│   │   │   ├── security.py          # OTP storage, JWT issuance, password hashing, auth dependencies
│   │   │   └── config.py            # Pydantic settings loaded from .env
│   │   └── main.py                  # FastAPI app, CORS, router registration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Citizen*.jsx     # Login, Home, Submit, Track, Updates, Profile
│   │   │   ├── Admin*.jsx       # Dashboard, Grievances, Constituents, Analytics, Settings
│   │   │   └── MPLogin.jsx      # MP email/password + OTP login
│   │   ├── layouts/             # CitizenLayout, AdminLayout shells
│   │   ├── components/          # Shared UI: StatCard, StatusChip, GrievanceTable, etc.
│   │   ├── context/AuthContext.jsx  # MP/citizen auth state
│   │   └── firebase.js          # Firebase Web SDK init
│   └── package.json
├── backend/.env.example
├── frontend/.env.example
└── README.md
```

## Logic Flows

### Citizen Report Submission

The sequence below shows a citizen submitting a report through the app —
from photo upload through Gemini analysis to the record landing in both
Firestore (for the live dashboard) and BigQuery (for priority ranking).

```mermaid
sequenceDiagram
    autonumber
    actor Citizen
    participant FE as Frontend (React)
    participant API as FastAPI Backend
    participant Cloudinary
    participant Gemini
    participant Firestore
    participant BigQuery

    Citizen->>FE: Attach photo + description, submit
    FE->>API: POST /ingestion/app-upload (multipart, Firebase ID token)
    API-->>FE: 200 "queued for AI processing"
    API->>Cloudinary: Upload media file
    Cloudinary-->>API: Secure media URL
    API->>Gemini: Analyze report (text + image)
    Gemini-->>API: category, severity, summary, actionable_insight
    API->>Firestore: Save complaint document
    API->>BigQuery: Append row to citizen_reports
    Citizen->>FE: Opens "Track" page
    FE->>API: GET /citizen/complaints
    API->>Firestore: Query complaints by citizen_uid
    Firestore-->>API: Complaint list
    API-->>FE: Complaint list with live status
```

### MP Priority Ranking

The MP dashboard's priority view combines live complaint data with
constituency demographics to rank development needs objectively.

```mermaid
flowchart TD
    classDef data fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000
    classDef process fill:#fff3e0,stroke:#ff9800,stroke-width:2px,color:#000
    classDef store fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000

    Reports["citizen_reports (BigQuery)"]:::data
    Demo["constituency_demographics (BigQuery)"]:::data
    Query["PRIORITY_QUERY: volume + severity + infra_score"]:::process
    Score["mp_priority_score per constituency"]:::store

    Reports --> Query
    Demo --> Query
    Query --> Score
```

## Installation and Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- A Firebase project with Authentication and Firestore enabled
- A GCP project with BigQuery enabled
- A Cloudinary account
- A Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Step-by-Step Installation

1. Clone the repository and navigate to the project root.

2. Set up the backend:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Fill in .env: GEMINI_API_KEY, GOOGLE_APPLICATION_CREDENTIALS, SECRET_KEY,
   # CLOUDINARY_*, GCP_PROJECT_ID
   ```

3. Download your Firebase service account key from Firebase Console →
   Project Settings → Service Accounts → Generate New Private Key. Save it in
   `backend/` and point `GOOGLE_APPLICATION_CREDENTIALS` at it in `.env`.
   Never commit this file.

4. Start the backend:

   ```bash
   uvicorn main:app --reload
   ```

   The API is live at `http://127.0.0.1:8000`.

5. Set up the frontend:

   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Set VITE_API_BASE_URL and your Firebase Web SDK config
   npm run dev
   ```

   The app is live at `http://localhost:5173`.

### Default MP Login (Demo)

A single MP account is seeded in `backend/app/core/security.py`:

- Email: `mp@janawaaz.in`
- Password: `hackathon2026`

OTPs (citizen and MP login) are generated server-side and printed to the
backend logs rather than sent via SMS — check the terminal running `uvicorn`
after requesting one.

## Usage Examples

### Health Check

```bash
curl -i http://127.0.0.1:8000/
```

Expected response:

```json
{
  "status": "Core engine online",
  "timestamp": 1751999999.123,
  "environment": "production",
  "project": "Jan Awaaz AI"
}
```

### Submit a Citizen Report

```bash
curl -X POST http://127.0.0.1:8000/api/v1/ingestion/app-upload \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -F "file=@pothole.jpg" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "description=Large pothole causing traffic near the market" \
  -F "constituency=Central District"
```

Expected response:

```json
{
  "status": "success",
  "message": "Media received and queued for AI processing",
  "file_tracked": "1751999999_pothole.jpg",
  "media_type": "image/jpeg"
}
```

### Get MP Dashboard Overview

```bash
curl -H "Authorization: Bearer YOUR_MP_JWT" \
  http://127.0.0.1:8000/api/v1/mp/dashboard/overview
```

Expected response:

```json
{
  "total_grievances": 42,
  "active_citizens": 30,
  "resolved_count": 12,
  "category_breakdown": [
    {"name": "Road", "count": 18, "pct": 43}
  ],
  "ai_insights": [
    "Most reported category: Road (18 reports, 43% of total)."
  ]
}
```

## Notes for Reviewers

- Firebase Web API keys in `frontend/.env` are safe to expose in client code
  by design — Firebase access control is enforced by Security Rules and API
  key restrictions, not by hiding the key.
- Real secrets (Gemini key, Cloudinary secret, JWT `SECRET_KEY`, Firebase
  service account JSON) live only in `backend/.env` and `backend/gcp-service-account.json`,
  both gitignored.