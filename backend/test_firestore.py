import firebase_admin
from firebase_admin import credentials
from google.cloud import firestore
import json

cred = credentials.Certificate("d:/janawaazai/backend/service-account.json")
firebase_admin.initialize_app(cred)

db = firestore.Client()
query = db.collection("complaints").where("citizen_uid", "==", "test_uid").order_by("created_at", "DESCENDING")

try:
    results = [doc.to_dict() for doc in query.stream()]
    print("SUCCESS")
    print(results)
except Exception as e:
    print("ERROR:")
    print(e)