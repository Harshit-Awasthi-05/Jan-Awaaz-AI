"""
Quick sanity check: confirms GOOGLE_APPLICATION_CREDENTIALS can write to
and read from Firestore in the correct project.
Run with: python test_firestore.py
"""
import os
from dotenv import load_dotenv

load_dotenv()

from google.cloud import firestore

def main():
    print(f"Using credentials from: {os.getenv('GOOGLE_APPLICATION_CREDENTIALS')}")

    db = firestore.Client()
    print(f"Connected to Firestore project: {db.project}")

    # Write a test document
    doc_ref = db.collection("_connection_test").document("ping")
    doc_ref.set({"status": "ok", "message": "Firestore connection working"})
    print("Write successful.")

    # Read it back
    doc = doc_ref.get()
    if doc.exists:
        print(f"Read back: {doc.to_dict()}")
    else:
        print("ERROR: Document not found after write.")

    # Clean up
    doc_ref.delete()
    print("Test document cleaned up. Firestore is working correctly.")

if __name__ == "__main__":
    main()