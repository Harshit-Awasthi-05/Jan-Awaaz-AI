import os
import sys
import uuid
import argparse

# Add the backend root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import get_password_hash
from app.core.firestore_client import get_db

def create_mp(email, name, constituency, phone, password, update=False):
    db = get_db()
    password_hash = get_password_hash(password)
    
    docs = list(db.collection("mp_users").where("email", "==", email).limit(1).stream())
    
    if docs and not update:
        print(f"Error: An MP with the email '{email}' already exists. Use --update to overwrite.")
        return

    doc = {
        "email": email,
        "name": name,
        "constituency": constituency,
        "phone": phone,
        "password_hash": password_hash,
    }
    
    if docs and update:
        docs[0].reference.update(doc)
        print(f"Successfully updated MP account for {name} ({email})")
    else:
        mp_id = str(uuid.uuid4())
        db.collection("mp_users").document(mp_id).set(doc)
        print(f"Successfully created MP account for {name} ({email}) in constituency {constituency}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or update an MP account in Firestore")
    parser.add_argument("--email", required=True, help="MP's email address")
    parser.add_argument("--name", required=True, help="MP's full name")
    parser.add_argument("--constituency", required=True, help="MP's constituency")
    parser.add_argument("--phone", required=True, help="MP's phone number (E.164 format, e.g. +919876543210)")
    parser.add_argument("--password", required=True, help="MP's password")
    parser.add_argument("--update", action="store_true", help="Update if MP already exists")
    
    args = parser.parse_args()
    create_mp(args.email, args.name, args.constituency, args.phone, args.password, args.update)
