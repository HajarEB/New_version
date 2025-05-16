#includes routing logic

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
from models.user import User
from models.patient import Patient
from models.doctor import Doctor
from models.admin import Admin
from schemas.admin import default_admin_update_admin, role_update
from schemas.user import user_update
from core.utils import get_current_admin, get_valid_user
from core.messages import default_admin_update, default_admin_privileges, admin_not_found, user_not_found, invalid_role, default_admin_privileges, user_role_change, status_expiry_change
from core.encryption import hash_lookup, encrypt, decrypt, patient_hash, admin_hash, doctor_hash, user_hash
router = APIRouter()



def create_patient(patient_user_id: int, db: Session = Depends(get_db)):
    db_user = get_valid_user(patient_user_id, db)
    db_patient = Patient(user_id=patient_user_id)
    db.add(db_patient)
    db_user.role_hash = patient_hash
    db.commit()
    db.refresh(db_patient)
    db.refresh(db_user)
    return db_user

def create_doctor(doctor_user_id: int, db: Session = Depends(get_db)):
    db_user = get_valid_user(doctor_user_id, db)
    db_doctor = Doctor(user_id=doctor_user_id)
    db.add(db_doctor)
    db_user.role_hash = doctor_hash
    db.commit()
    db.refresh(db_doctor)
    db.refresh(db_user)
    return db_user

def create_admin(admin_user_id: int, db: Session = Depends(get_db)):
    db_user =  get_valid_user(admin_user_id, db)
    db_admin = Admin(user_id=admin_user_id)
    db.add(db_admin)
    db_user.role_hash = admin_hash
    db.commit()
    db.refresh(db_admin)
    db.refresh(db_user)
    return db_user

@router.post("/getNonAssignedUsers/")
def get_non_assigned_users( db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    user_data = db.query(User).filter(User.is_valid == 1, User.role_hash == user_hash).all()
    result = []
    if not user_data:
        return result
    else:
        for user in user_data:
            if user.user_id == 1:
                continue
            else:
                info ={"user_id": user.user_id,
                    "full_name": str(decrypt(user.first_name)) + " " + str(decrypt(user.last_name)),
                    "username":decrypt(user.username) ,
                    "role": decrypt(user.role)}
                result.append(info)
    return result

@router.put("/updateRole/", response_model=user_update)
def update_user_role(
    role_update: role_update, 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin)):
    if role_update.user_id == 1:
        raise HTTPException(status_code=404, detail=default_admin_update)
    roles = ['admin', 'doctor', 'patient', 'user']
    role_update.new_role = role_update.new_role.lower()
    if role_update.new_role not in roles:
        raise HTTPException(status_code=404, detail = invalid_role)
    
    db_user =  get_valid_user(role_update.user_id, db)
    if db_user.role_hash != user_hash and db_user.role_hash != hash_lookup(role_update.new_role):
        raise HTTPException(status_code=404, detail= user_role_change)
    
    #set the status = false and status_expiry date in the corresponding table 
    if db_user.role_hash == patient_hash:
        search_db = db.query(Patient).filter(Patient.user_id==role_update.user_id).all()
        for current_user in search_db:
            if current_user.is_patient == True:
                current_user.is_patient = False
                current_user.status_expiry = datetime.now(timezone.utc)
                db.add(current_user)
    elif db_user.role_hash == doctor_hash:
        search_db = db.query(Doctor).filter(Doctor.user_id==role_update.user_id).all()
        for current_user in search_db:
            if current_user.is_doctor == True:
                current_user.is_doctor = False
                current_user.status_expiry = datetime.now(timezone.utc)
                db.add(current_user)
    elif db_user.role_hash == admin_hash:
        search_db = db.query(Admin).filter(Admin.user_id==role_update.user_id).all()
        for current_user in search_db:
            if current_user.is_admin == True:
                current_user.is_admin = False
                current_user.status_expiry = datetime.now(timezone.utc)
                db.add(current_user)
    db.commit()
                
    #create a new entry in the corresponding table
    if role_update.new_role == "doctor":
        create_doctor(role_update.user_id, db)
    elif role_update.new_role == "patient":
        create_patient(role_update.user_id, db)
    elif role_update.new_role == "admin":
        create_admin(role_update.user_id, db)
        
    #update role in the user table
    db_user.role = encrypt(role_update.new_role)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_admin_name_by_id(admin_id: int, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.admin_id==admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail= admin_not_found)
    user = db.query(User).filter(User.user_id == admin.user_id).first() 
    if not user:
        raise HTTPException(status_code=404, detail= user_not_found)
    return  f"{decrypt(user.first_name)} {decrypt(user.last_name)}"

@router.get("/isDefaultAdmin/")
def is_default_admin(current_admin: User = Depends(get_current_admin)):
    if current_admin.user_id ==1:
        return True
    return False
    


@router.put("/update_admin_status_expiry/")
def update_admin_status_expiry(admin_info: default_admin_update_admin, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    if admin_info.id ==1:
        raise HTTPException(status_code=404, detail= default_admin_update)
    admin = db.query(Admin).filter(Admin.admin_id == admin_info.id).first()
    if not admin:
        raise HTTPException(status_code=404, detail=admin_not_found)
    
    if admin.status_expiry:
        raise HTTPException(status_code=404, detail=status_expiry_change)
    
    if admin_info.status_expiry <=  datetime.now(timezone.utc):
        admin.is_admin = 0
    admin.status_expiry = admin_info.status_expiry
    db.commit()
    db.refresh(admin)
    
    

@router.post("/getAllAdmins/")
def get_all_admins(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    if current_admin.user_id == 1:    
        info = []
        admin_db = db.query(Admin).all()
        for admin in admin_db:
            admin_name = get_admin_name_by_id(admin.admin_id,db)
            user = db.query(User).filter(User.user_id == admin.user_id).first() 
            if not user:
                raise HTTPException(status_code=404, detail=user_not_found)
            app_data = {"admin_id": admin.admin_id,
                        "admin_name":admin_name,
                        "username":decrypt(user.username),
                        "status_expiry": admin.status_expiry,
                        "email":decrypt(user.email),
                        "phone_number": decrypt(user.phone_number)}
            info.append(app_data)
        return info
    raise HTTPException(status_code=404, detail=default_admin_privileges)
