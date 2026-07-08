from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import threading
import time
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jan-awaaz-ai-zeta.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/citizen")
@router.post("/request-otp")
def req_otp():
    return {"status": "ok"}
app.include_router(router, prefix="/api/v1")

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")

if __name__ == "__main__":
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(2)
    
    print("Sending preflight...")
    res = requests.options("http://127.0.0.1:8001/api/v1/citizen/request-otp", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
    })
    print(f"STATUS: {res.status_code}")
    print(f"HEADERS: {res.headers}")
    print(f"BODY: {res.text}")
