# Common helper functions

from datetime import datetime
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from core.messages import invalid_phone_number, invalid_email, invalid_name , user_not_found,patient_not_found, doctor_not_found, database_error, authentication_error, default_admin_missing,admin_privileges 

from core.security import verify_password, oauth2_scheme
from core.encryption import hash_lookup, patient_hash, admin_hash, doctor_hash
from database import get_db
from models.user import User
from models.patient import Patient
from models.admin import Admin
from models.doctor import Doctor
from models.appointment import Appointment
from models.tokenBlacklist import TokenBlacklist
from core.config import settings
from schemas.token import token_data
import re


# function to deactivate user appointments
def deactivate_user_appointments(user_id:int, db: Session = Depends(get_db)):
    
    # check if user exists in db
    user =  db.query(User).filter(User.user_id == user_id).first()
    updated_db = False
    if not user:  
        raise HTTPException(status_code=404, detail=user_not_found)
    
    # get corresponding appointment in case user is a patient or doctor
    if user.role_hash == patient_hash:
        patient = db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail= patient_not_found)
        appointments = db.query(Appointment).filter(Appointment.patient_id == patient.patient_id).all()
    elif user.role_hash == doctor_hash:
        doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail= doctor_not_found)
        appointments = db.query(Appointment).filter(Appointment.doctor_id == doctor.doctor_id).all()
    else:
        raise HTTPException(status_code=404, detail= user_not_found) #user is not a doctor nor a patient
    
    for appointment in appointments: #set appointments to cancelled
        if appointment.status != "COMPLETED" and appointment.status != "CANCELLED":
            appointment.status = "CANCELLED"
            updated_db = True
    if updated_db: 
        db.commit()
        for appointment in appointments:
            db.refresh(appointment)
            
     
        

# Get user from database using username as input
def get_user(username: str, db: Session):
    user = db.query(User).filter(User.username_hash == hash_lookup(username), User.is_valid == 1).first()   
    
    return user     

# authenticate user
def authenticate_user(username: str, password: str, db: Session):
    user = get_user(username, db)
    
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    if not user.is_valid:       # check if user is deleted or not
        return False
    return user
   

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)): # check if the current requester is a valid, logged in user 
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # verify expired session token
    try:
        if is_logged_out(token, db): # user is already logged out
            raise HTTPException(status_code=400, detail=authentication_error)
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]) #decode token
        user_id = payload.get("sub") #extract user_id
        if not user_id: #raise exception if user is not found
            raise credentials_exception 
        token_exp = payload.get("exp") # extract token_expiry date
        if datetime.utcnow().timestamp() > token_exp:  #token is no longer valid
            raise HTTPException( 
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Expired Session",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_values = token_data(user_id=user_id)
    except JWTError:
        raise credentials_exception
    

    user = db.query(User).filter(User.user_id==token_values.user_id).first()

    if user is None:
        raise credentials_exception
    return user



async def get_default_admin(db: Session = Depends(get_db)): # get default admin access privileges
    default_admin = db.query(User).filter(User.user_id == 1).first()
    if not default_admin:
        raise HTTPException(status_code=403, detail=default_admin_missing)
    return default_admin 
     

# Admin role check
def get_current_admin(current_user: User = Depends(get_current_user)): # check if the current logged in user has admin access rights or no 
    if current_user.role_hash != admin_hash:
        raise HTTPException(status_code=403, detail=admin_privileges)
    return current_user


              
def is_user_valid(id, table, db): #check user validity in the corresponding table, meaning check if user is set to expired: this function returns a boolean value
    if table == "patient":
        db_search = db.query(Patient).filter(Patient.patient_id==id).first()
        if db_search is None:
            return False
        elif db_search.is_patient == True: # if patient is still valid
            return True
        return False
    elif table == "admin":
        db_search = db.query(Admin).filter(Admin.admin_id==id).first()
        if db_search is None:
            return False
        elif db_search.is_admin == True:  # if admin is still valid
            return True
        return False
    elif table == "doctor":
        db_search = db.query(Doctor).filter(Doctor.doctor_id==id).first()
        if db_search is None:
            return False
        elif db_search.is_doctor == True:  # if doctor is still valid
            return True
        return False
    elif table == "user":
        db_search = db.query(User).filter(User.user_id==id).first()
        if db_search is None:
            return False
        elif db_search.is_valid == True:  # if user is still valid
            return True
        return False
    else:
        raise HTTPException(status_code=404, detail=database_error) #inexistant_table

def is_logged_out (token: str, db: Session = Depends(get_db)): #check if token is within blacklist table
    db_search = db.query(TokenBlacklist).filter(TokenBlacklist.access_token==token).first()
    if db_search is None:
        return False
    return True
    
    
def get_valid_user(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.user_id==user_id).all()
    for current_user in user_db:
        if current_user.is_valid == True:
            return current_user
    raise HTTPException(status_code=404, detail=user_not_found)

def is_name_valid(name: str): # check names validity: only alphabetic characters are accepted  and a name can't be composed of more than 2 parts
    if len(name.split(' ')) == 2 :
        if name.split(' ')[0].isalpha() and name.split(' ')[1].isalpha() : 
            return True
    raise HTTPException(status_code=400, detail=invalid_name )

def is_email_valid(email: str): #checks the validity of the email structure
    if re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email):
        return True
    raise HTTPException(status_code=400, detail=invalid_email)

def is_phone_number_valid(number: str): # checks the validity of the phone number format
    number = number.replace(" ", "")  # remove spaces from the input
    if len(number)<10 or len(number)>= 15:
        raise HTTPException(status_code=400, detail=invalid_phone_number)
    else:
        if re.match(r'^\+\d{1,3}\d{8,14}$',number): # phone number should always start by the country code , then the necessary digits
            return True
    raise HTTPException(status_code=400, detail=invalid_phone_number)

def is_strong_password(password: str):
    # Password should meet criteria such as:
    # Minimum length: 8 characters
    # At least one uppercase
    # At least one lowercase
    # At least one digit
    # At least one special character
    if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password) or not re.search(r'\d', password) or not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True