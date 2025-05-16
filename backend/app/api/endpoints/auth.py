from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer

from models.user import User
from models.tokenBlacklist import TokenBlacklist

from schemas.user import user_create
from schemas.token import token, token_value
from core.security import hash_password, create_access_token, decode_token, decode_expired_token 
from core.config import settings
from core.utils import authenticate_user, get_current_user, is_name_valid, is_email_valid, is_phone_number_valid, is_strong_password
from database import get_db
from datetime import datetime, timedelta
from core.messages import username_used, email_used, invalid_name, already_logged_out, phone_number_used, weak_password
from core.encryption import encrypt, hash_lookup, user_hash
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/register/")
def register(user_data: user_create, db: Session = Depends(get_db)):
    # check if username, email already exists
    username_hash = hash_lookup(user_data.username)
    existing_user = db.query(User).filter(User.username_hash == username_hash).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail=username_used)
    email_hash = hash_lookup(user_data.email)

    if not is_strong_password(user_data.password):
        raise HTTPException(status_code=400, detail=weak_password)
    
    existed_email = db.query(User).filter(User.email_hash == email_hash).first()
    if existed_email:
        raise HTTPException(status_code=400, detail=email_used)
    
    hashed_password = hash_password(user_data.password)
    if user_data.first_name and user_data.last_name:
        name = user_data.first_name + ' '+ user_data.last_name
        if is_name_valid(name):
            if  is_email_valid(user_data.email) and is_phone_number_valid(user_data.phone_number):
                phone_number_hash = hash_lookup(user_data.phone_number)
                existing_phone_number = db.query(User).filter(User.phone_number_hash == phone_number_hash).first()
                if existing_phone_number:
                    raise HTTPException(status_code=400, detail=phone_number_used)
                # create new user object
                db_user = User(
                    first_name = encrypt(user_data.first_name),
                    last_name = encrypt(user_data.last_name),
                    username = encrypt(user_data.username), 
                    username_hash = username_hash,
                    email = encrypt(user_data.email), 
                    email_hash = email_hash,
                    hashed_password = hashed_password,
                    phone_number = encrypt(user_data.phone_number),
                    phone_number_hash = phone_number_hash,
                    role = encrypt("user"),
                    role_hash = user_hash
                )
                # add new user to database
                db.add(db_user)
                db.commit()
                db.refresh(db_user)
                return {"message": "User Registered Successfully"}
            #exceptions are raised within these functions
        else:
            raise HTTPException(status_code=400, detail=invalid_name)

    raise HTTPException(status_code=400, detail=invalid_name)
   

    
# User login and return token
@router.post("/login/")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
    ) -> token:
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id)}, expires_delta=access_token_expires
    )
    return token(access_token=access_token, token_type="bearer")

@router.post("/logout/")
def logout(
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    decoded_token = verify_token(token, db)
    if decoded_token:
        # Blacklist token 
        blacklist_db = TokenBlacklist(access_token = token, expired_at = datetime.utcnow() )
        db.add(blacklist_db)
        db.commit()
        db.refresh(blacklist_db)
        return {"msg": "DONE"}

@router.post("/setTokenToExpired/")
def set_token_to_expired(data: token_value, db: Session = Depends(get_db)):
    blacklist_token = db.query(TokenBlacklist).filter(TokenBlacklist.access_token == data.token).first()
    if blacklist_token:
        return {"msg": "Already Logged Out"}

    # check the encoded token is the right one
    decoded_token = decode_expired_token(data.token)
    if decoded_token:
        # Blacklist token 
        blacklist_db = TokenBlacklist(access_token =data.token, expired_at = datetime.utcnow() )
        db.add(blacklist_db)
        db.commit()
        db.refresh(blacklist_db)
        return {"msg": "DONE"}
    else:
        return {"msg": "COULD NOT DECODE TOKEN"}
        
        
    
def verify_token(token : str, db: Session = Depends(get_db)):
    #search for token in the blacklist_token table
    blacklist_token = db.query(TokenBlacklist).filter(TokenBlacklist.access_token == token).first()
    if blacklist_token:
        raise HTTPException(status_code=401, detail=already_logged_out)

    return decode_token(token)
        
