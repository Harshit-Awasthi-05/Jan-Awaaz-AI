import requests

res = requests.options("http://127.0.0.1:8000/api/v1/citizen/request-otp", headers={
    "Origin": "http://localhost:5173",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type"
})
print("STATUS:", res.status_code)
print("HEADERS:", res.headers)
print("BODY:", res.text)
