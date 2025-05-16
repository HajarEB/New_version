from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from schemas.doctor import admin_update_doctor
from database import get_db
from core.utils import get_current_user, get_current_admin, deactivate_user_appointments
from models.user import User
from models.doctor import Doctor
from core.messages import doctor_not_found, user_not_found, admin_privileges,status_expiry_change
from core.encryption import decrypt, hash_lookup, admin_hash
router = APIRouter()




def get_doctor_name_by_id(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.doctor_id==doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail=doctor_not_found)
    user = db.query(User).filter(User.user_id == doctor.user_id).first() 
    if not user:
        raise HTTPException(status_code=404, detail=user_not_found )
    return  f"{decrypt(user.first_name)} {decrypt(user.last_name)}"



def get_doctor_id_by_username(doctor_username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username_hash == hash_lookup(doctor_username)).first() 
    if not user:
        raise HTTPException(status_code=404, detail=user_not_found )
    doctor = db.query(Doctor).filter(Doctor.user_id == user.user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail=doctor_not_found)
    return doctor.doctor_id

def get_doctor_id_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first() 
    if not user:
        raise HTTPException(status_code=404, detail=doctor_not_found)
    doctor = db.query(Doctor).filter(Doctor.user_id== user.user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail=doctor_not_found)
    return doctor.doctor_id

def get_doctor_specialty_by_id(doctor_id: int,db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.doctor_id == doctor_id, Doctor.is_doctor ==1).first()
    if not doctor: 
        raise HTTPException(status_code=404, detail=doctor_not_found)
    return decrypt(doctor.doctor_specialty)

@router.post("/getAllDoctors/")
def get_all_doctors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role_hash == admin_hash:
        info = []
        doctor_db = db.query(Doctor).all()
        for doctor in doctor_db:
            doctor_name = get_doctor_name_by_id(doctor.doctor_id,db)
            user = db.query(User).filter(User.user_id == doctor.user_id).first() 
            if not user:
                raise HTTPException(status_code=404, detail=user_not_found)
            app_data = {"doctor_id": doctor.doctor_id,
                        "doctor_name":doctor_name,
                        "username":decrypt(user.username),
                        "status_expiry": doctor.status_expiry,
                        "email":decrypt(user.email),
                        "specialty": decrypt(doctor.doctor_specialty),
                        "phone_number": decrypt(user.phone_number)}
            info.append(app_data)
        return info
    raise HTTPException(status_code=404, detail=admin_privileges)

@router.get("/getAllSpecialty/")
def get_all_specialty(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    specialty_list = db.query(Doctor.doctor_specialty).filter(
        or_(
            Doctor.status_expiry == None,
            Doctor.status_expiry > datetime.now(timezone.utc)
        )
        ).distinct().all()
    return [decrypt(specialty[0]) for specialty in specialty_list]

@router.put("/update_doctor_status_expiry/")
def update_doctor_status_expiry(doctor_info: admin_update_doctor, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    doctor = db.query(Doctor).filter(Doctor.doctor_id == doctor_info.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail=doctor_not_found )
    
    if doctor.status_expiry:
        raise HTTPException(status_code=404, detail=status_expiry_change)
    
    if doctor_info.status_expiry <=  datetime.now(timezone.utc):
        deactivate_user_appointments(doctor.user_id, db)
        doctor.is_doctor = 0
        user = db.query(User).filter(User.user_id == doctor.user_id).first() 
        if not user:
            raise HTTPException(status_code=404, detail=user_not_found)
        user.is_valid = 0
        db.commit()
        db.refresh(user)
        
    doctor.status_expiry = doctor_info.status_expiry
    db.commit()
    db.refresh(doctor)
    
    
def is_doctor_valid(user_id:int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id==user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail=doctor_not_found )
    if doctor.is_doctor == 0:
        return 0
    return doctor.doctor_id

def get_doctor_id(user_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id, Doctor.is_doctor == 1).first()
    if not doctor:
        raise HTTPException(status_code=404, detail=doctor_not_found )
    return doctor.doctor_id