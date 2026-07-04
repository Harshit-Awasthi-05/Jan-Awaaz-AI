import firebase_admin
import os
import sys
from dotenv import load_dotenv


load_dotenv()

def init_firebase():
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    if not cred_path:
        print("ERROR: GOOGLE_APPLICATION_CREDENTIALS .env me nahi mila!")
        sys.exit(1)

    if not firebase_admin._apps:
        try:
            firebase_admin.initialize_app()
            print("Firebase successfully initialized using .env credentials!")
        except Exception as e:
            print(f"ERROR initializing Firebase: {e}")
            sys.exit(1)