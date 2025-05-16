from http.client import HTTPException
from cryptography.fernet import Fernet
from hashlib import sha256
import base64
from core.config import settings
from core.messages import internal_error

# Get the DB_SECRET_KEY from the environment
DB_SECRET_KEY = settings.DB_SECRET_KEY


hashed_key = sha256(DB_SECRET_KEY.encode()).digest() # Hash DB_SECRET_KEY  to produce a 32-byte Fernet encryption key
cipher = Fernet(base64.urlsafe_b64encode(hashed_key)) # Ensure the generated key is properly formatted

#encrypt data using Fernet
def encrypt(text: str) -> str:  
    try:
        cipher_text = cipher.encrypt(text.encode()).decode()
        return cipher_text 
    except Exception:
        raise HTTPException(status_code=500, detail= internal_error)
        

#decrypt data using Fernet
def decrypt(token: str) -> str:
    try:
        plain_text = cipher.decrypt(token.encode()).decode()
        return plain_text
    except Exception:
        raise HTTPException(status_code=500, detail= internal_error)

# hash values using sha256
def hash_lookup(text: str) -> str:      # will be used to check for similar values
    return sha256(text.encode()).hexdigest()

patient_hash = hash_lookup("patient")
doctor_hash = hash_lookup("doctor")
admin_hash = hash_lookup("admin")
user_hash = hash_lookup("user")