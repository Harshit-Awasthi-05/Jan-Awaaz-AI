from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
import time
from app.core.config import settings
from app.api.auth import auth
from app.api.ingestion import router as ingestion_router
from app.api.citizen import router as citizen_router   
from app.api.mp import router as mp_router
from app.api.location import router as location_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred)
    yield

app = FastAPI(
    title="Jan Awaaz AI",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error_code": "SERVER_ERR"}
    )

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(ingestion_router.router, prefix=settings.API_V1_STR)
app.include_router(citizen_router.router, prefix=settings.API_V1_STR)  
app.include_router(mp_router.router, prefix=settings.API_V1_STR) 
app.include_router(location_router.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "Core engine online", 
        "timestamp": time.time(),
        "environment": "production",
        "project": "Jan Awaaz AI"
    }