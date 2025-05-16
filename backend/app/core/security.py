# includes  token generation, password hashing, OAuth2 logic that the entire app needs 

from datetime import datetime, timedelta, timezone
from http.client import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from core.config import settings
import bcrypt
from core.messages import expired_token, invalid_token


ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
ALGORITHM = settings.ALGORITHM
JWT_SECRET_KEY = settings.JWT_SECRET_KEY

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Hash password using bcrypt
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

# Verify password using bcrypt
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# create Json Web Token (JWT)
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    
    # set the expiration date: expires_delta: in case it is given otherwise generate a new one based on ACCESS_TOKEN_EXPIRE_MINUTES settings
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    
    #add the new key-value exp
    to_encode.update({"exp": expire})
    
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)


#decode valid tokens
def decode_token (encoded_token:str):
    try: 
        decoded = jwt.decode(encoded_token, JWT_SECRET_KEY, algorithms=[ALGORITHM]) 
        return decoded
    
    except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail=expired_token)  # Handle expired token
    except JWTError:
        raise HTTPException(status_code=401, detail=invalid_token)  # Handle invalid token
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")  # Catch all other exceptions

#decode expired tokens
def decode_expired_token (encoded_token:str):
    try: 
        decoded = jwt.decode(encoded_token, JWT_SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False}) 
        return decoded
    except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail=expired_token)  # Handle expired token
    except JWTError:
        raise HTTPException(status_code=401, detail=invalid_token)  # Handle invalid token
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")  # Catch all other exceptions