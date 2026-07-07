import httpx
import time
import os

BASE_URL = "http://localhost:8000"

def test_mp_flow():
    print("\n--- 🏛️ TESTING MP DASHBOARD AUTHENTICATION ---")
    
    # 1. Initiate Login
    login_payload = {
        "email": os.environ.get("MP_EMAIL", "mp@janawaaz.in"),
        "constituency": os.environ.get("MP_CONSTITUENCY", "Jan Awaaz Constituency"),
        "password": os.environ.get("MP_PASSWORD", "hackathon2026")
    }
    print("1. Sending Login Credentials...")
    login_res = httpx.post(f"{BASE_URL}/api/v1/mp/login", json=login_payload)
    print(f"Status: {login_res.status_code} | Response: {login_res.json()}")
    
    if login_res.status_code != 200:
        print("❌ Login failed. Check credentials.")
        return


    otp_code = input("\n👇 Enter the OTP printed in your FastAPI terminal: ")
    

    verify_payload = {
        "email": "mp@janawaaz.in",
        "otp": otp_code
    }
    print("\n2. Verifying OTP...")
    verify_res = httpx.post(f"{BASE_URL}/api/v1/mp/verify-otp", json=verify_payload)
    print(f"Status: {verify_res.status_code}")
    
    if verify_res.status_code == 200:
        token = verify_res.json().get("access_token")
        print(f"✅ Success! MP JWT Token Received: {token[:30]}...[TRUNCATED]")
    else:
        print(f"❌ OTP Verification Failed: {verify_res.json()}")

def test_citizen_flow():
    print("\n--- 📱 TESTING CITIZEN WEBHOOK AUTHENTICATION ---")
    print("Note: To fully test this, you need a valid Firebase ID token.")
    print("If you send a request without one, it should cleanly block you with a 401.")
    
   
    headers = {"Authorization": "Bearer invalid_or_missing_token"}
    payload = {"report_details": "Pothole on Main St."}
    
    res = httpx.post(f"{BASE_URL}/api/v1/citizen/report", json=payload, headers=headers)
    print(f"Status: {res.status_code} | Response: {res.json()}")
    
    if res.status_code == 401:
        print("✅ Success! The API successfully blocked an unauthorized citizen report.")

if __name__ == "__main__":
    test_mp_flow()
    test_citizen_flow()