from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from models.doctor import Doctor
from database import SessionLocal, get_db
from sqlalchemy.orm import Session
from schemas.appointment import  admin_appointment_update, get_available_appointment_by_appointment_id, user_appointment_update, get_available_appointment, create_new_appointment
from models.appointment import Appointment
from models.user import User
from models.patient import Patient
from .patients import get_patient_name_by_id, get_patient_id_by_user_id, is_patient_valid, get_patient_id, get_patient_status_expiry_by_id
from .doctors import get_doctor_name_by_id,  get_doctor_id_by_user_id, is_doctor_valid, get_doctor_id, get_doctor_specialty_by_id
from core.utils import is_user_valid, get_current_user, get_current_admin
from core.encryption import hash_lookup, encrypt, decrypt, patient_hash, admin_hash, doctor_hash
from datetime import datetime, time, timedelta, timezone
from core.messages import doctor_not_found, user_not_found, patient_not_found,appointment_not_found, non_updatable_appointment, admin_privileges, doctor_privileges, invalid_chosen_status, patient_privileges, invalid_date, general_privileges_update, invalid_status, appointment_created, appointment_invalid,appointment_reserved, expired_before_appoinment
router = APIRouter()

allowed_status = ['SCHEDULED', 'CANCELLED', 'IN PROGRESS', 'COMPLETED', 'CONFIRMED']


def check_appointments():
    db = SessionLocal()
    appointments = db.query(Appointment).filter(Appointment.status != "COMPLETED", Appointment.status != "CANCELLED").all()
    for appointment in appointments:
        now = datetime.now()
        if appointment.date_time <= now < appointment.date_time + timedelta(hours=1): #within 1 hour of appointment starting time 
            appointment.status = "IN PROGRESS"
        elif now >= appointment.date_time + timedelta(hours=1): # more than 1 hour since the appointment starting time 
            appointment.status = "COMPLETED"
        #else: future date
        db.commit()
        db.refresh(appointment)
    db.close()
        
            
            

@router.post("/getAllAppointments/")
def get_all_appointments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role_hash== admin_hash:
        info = []
        appointment_db = db.query(Appointment).all()
        for appointment in appointment_db:
            patient_name = get_patient_name_by_id(appointment.patient_id,db)
            doctor_name = get_doctor_name_by_id(appointment.doctor_id,db)
            app_data = {"appointment_id": appointment.appointment_id,
                        "patient_name":patient_name,
                        "doctor_name":doctor_name,
                        "description":decrypt(appointment.description),
                        "date_time":appointment.date_time,
                        "status": appointment.status }
            info.append(app_data)

        return info
    raise HTTPException(status_code=404, detail = admin_privileges)

@router.post("/getDoctorAppointments/")
def get_doctor_appointments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doctor_id = get_doctor_id(current_user.user_id, db)
    info = []
    appointments = db.query(Appointment).filter(Appointment.doctor_id == doctor_id).all()
    for appointment in appointments:
        patient_name = get_patient_name_by_id(appointment.patient_id,db)
        app_data = {"appointment_id": appointment.appointment_id,
                "patient_name":patient_name,
                "description":decrypt(appointment.description),
                "date_time":appointment.date_time,
                "status": appointment.status}
        info.append(app_data)
    return info



@router.post("/getPatientAppointments/")
def get_patient_appointments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient_id = get_patient_id(current_user.user_id, db)
    info = []
    appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).all()
    for appointment in appointments:
        doctor_name = get_doctor_name_by_id(appointment.doctor_id,db)
        doctor_specialty = get_doctor_specialty_by_id(appointment.doctor_id,db)
        app_data = {"appointment_id": appointment.appointment_id,
                "doctor_name":doctor_name,
                "description":decrypt(appointment.description),
                "specialty":doctor_specialty,
                "date_time":appointment.date_time,
                "status": appointment.status }
        info.append(app_data)
    return info



@router.put("/adminUpdateAppointment/")
def admin_update_appointment(data: admin_appointment_update,
                             db: Session = Depends(get_db),
                             current_admin: User = Depends(get_current_admin)):
    appointment = db.query(Appointment).filter(Appointment.appointment_id == data.id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail=appointment_not_found)
    
    if appointment.status =="COMPLETED" or appointment.status =="CANCELLED":
        raise HTTPException(status_code=404, detail=non_updatable_appointment)
    
    if appointment.date_time <= datetime.now():
        if data.status.upper() == "COMPLETED" or data.status.upper() == "CANCELLED":
            appointment.status = data.status.upper()
        else:
            raise HTTPException(status_code=404, detail=non_updatable_appointment)
    else:
        if not is_user_valid(appointment.patient_id, "patient", db):
            raise HTTPException(status_code=404, detail=patient_not_found)

        if not is_user_valid(appointment.doctor_id , "doctor", db):
            raise HTTPException(status_code=404, detail=doctor_not_found) 

        if data.description:
            appointment.description = encrypt(data.description)
            
        if data.date_time:
            if data.date_time <  datetime.now((timezone.utc)):
                raise HTTPException(status_code=404, detail= invalid_date )
            
            appointment.date_time = data.date_time
            
        if data.status:
            if data.status.upper() not in allowed_status:
                raise HTTPException(status_code=404, detail= invalid_status)
            
            if data.status.upper() == "COMPLETED" and data.date_time > datetime.now(timezone.utc):
                raise HTTPException(status_code=404, detail= invalid_chosen_status + data.status.upper() )
            
            if data.status.upper() == "IN PROGRESS" and data.date_time != datetime.now(timezone.utc):
                raise HTTPException(status_code=404, detail= invalid_chosen_status + data.status.upper())
            
            appointment.status = data.status.upper()
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment Successfully Updated"}



@router.put("/userUpdateAppointment/")
def user_update_appointment(data: user_appointment_update,
                             db: Session = Depends(get_db),
                             current_user: User = Depends(get_current_user)
                             ):
    date_updated= False
    current_appointment = db.query(Appointment).filter(Appointment.appointment_id == data.id).first()
    if not current_appointment:
        raise HTTPException(status_code=404, detail = appointment_not_found)
    
    if current_appointment.status =="COMPLETED" or current_appointment.status =="CANCELLED":
        raise HTTPException(status_code=404, detail = non_updatable_appointment)
    
    if current_appointment.date_time <= datetime.now():
        if data.status.upper() == "COMPLETED" or data.status.upper() == "CANCELLED":  # set a past appointment to complete or cancelled
            current_appointment.status = data.status.upper()
        else:
            raise HTTPException(status_code=404, detail=non_updatable_appointment)
    else:
        # Ensure that the logged-in user is a doctor/ patient and they are updating their own information
        if current_user.role_hash == doctor_hash:
            doctor_id = is_doctor_valid(current_user.user_id, db)
            if doctor_id == 0:
                raise HTTPException(status_code=404, detail= doctor_privileges)
            if current_appointment.doctor_id != doctor_id:
                raise HTTPException(status_code=404, detail= general_privileges_update)
        
        elif current_user.role_hash == patient_hash:
            patient_id = is_patient_valid(current_user.user_id, db)
            if patient_id == 0:
                raise HTTPException(status_code=404, detail=patient_privileges)
            if current_appointment.patient_id != patient_id:
                raise HTTPException(status_code=404, detail=general_privileges_update)
        
        
        # check if that slot is already reserved
        appointments_check = db.query(Appointment).filter(Appointment.doctor_id == current_appointment.doctor_id,
                                        Appointment.patient_id != current_appointment.patient_id,       
                                        Appointment.date_time == data.date_time).all()
        
        if appointments_check:
            return {"message": "This time is reserved"}
        
        
        if data.description:
            current_appointment.description = encrypt(data.description)
            
        if data.date_time:
            if data.date_time <  datetime.now(timezone.utc):
                raise HTTPException(status_code=404, detail=invalid_date)
            if data.date_time != current_appointment.date_time:
                current_appointment.date_time = data.date_time 
                date_updated = True
                
            
        if data.status:
            if current_user.role_hash == patient_hash and (data.status.upper() != "CANCELLED" and data.status.upper() != current_appointment.status.upper() ):
                raise HTTPException(status_code=404, detail = invalid_status)
            
            if data.status.upper() not in allowed_status: #doctor is the one updating the status
                raise HTTPException(status_code=404, detail = invalid_status)
    
            if data.status.upper() == "COMPLETED" and data.date_time > datetime.now(timezone.utc):
                raise HTTPException(status_code=404, detail = invalid_chosen_status + data.status.upper() )
            
            if data.status.upper() == "IN PROGRESS" and data.date_time != datetime.now(timezone.utc):
                raise HTTPException(status_code=404, detail = invalid_chosen_status + data.status.upper() )
            if date_updated and data.status != "CANCELLED" and  data.status != current_appointment.status and current_user.role_hash == patient_hash:
                current_appointment.status = "SCHEDULED"  
            else:
                current_appointment.status = data.status.upper()
        
    db.commit()
    db.refresh(current_appointment)
    return {"message": "Appointment Successfully Updated"}



def get_user_appointments_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user_db =  db.query(User).filter(User.user_id == user_id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail=user_not_found)
    if user_db.role == "patient":
        patient_id = get_patient_id_by_user_id(user_id,db)
        appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).all()
    elif user_db.role == "doctor":
        doctor_id = get_doctor_id_by_user_id(user_id,db)
        appointments = db.query(Appointment).filter(Appointment.doctor_id == doctor_id).all()
    return appointments


    
    
    



@router.delete("/deactivateAppointment/{id}")
def deactivate_appointment(appointment_id:int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.appointment_id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail=appointment_not_found)
    appointment.status = "CANCELLED"
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment Deactivated"}

##### For new appointment #####
time_slots = {
    1: time(8, 0),   # 8:00 AM for Time Slot 1
    2: time(11, 0),  # 11:00 AM for Time Slot 2
    3: time(14, 0)   # 2:00 PM for Time Slot 3
}



def split_time_to_slot(date_time_obj: datetime):
    time_part = date_time_obj.time()

    time_slot = None
    for slot, time_for_slot in time_slots.items():
        if time_part < time(8,0):
            time_slot = 1
        elif time_part >= time_for_slot and (time_part < time_slots.get(slot + 1, time(23, 59))):
            time_slot = slot
            break

    return time_slot




def combine_date_time_slot(date: datetime, timeslot: int) -> datetime:
    selected_time = time_slots.get(timeslot)
    if not selected_time:
        raise ValueError("Invalid timeslot selected.")
    return datetime.combine(date, selected_time)




@router.post("/getAvailableAppointmentByAppointmentId")
def get_available_appointment_by_appointment_id(
    data: get_available_appointment_by_appointment_id, 
    db: Session = Depends(get_db)):
    current_appointment = db.query(Appointment).filter(Appointment.appointment_id ==data.appointment_id).first()
    if not current_appointment:
        raise HTTPException(status_code=404, detail=appointment_not_found)

    slot_available = {1: True, 2: True, 3: True}        # by default all 3 slots will be vacant

    # query appointment based on doctor_id and the date 
    appointments_db = db.query(Appointment).filter(
                Appointment.doctor_id == current_appointment.doctor_id,
                Appointment.date_time >= datetime.combine(data.date, datetime.min.time()),  # Convert date to datetime
                Appointment.date_time < datetime.combine(data.date, datetime.max.time())
                ).all()
    
    if appointments_db : # if there is appointment on the date
        for appointment in appointments_db:     
                slot = split_time_to_slot(appointment.date_time)
                if appointment.status != "CANCELLED" and appointment.appointment_id != data.appointment_id:       # if the slot is not cancelled then it is reserved
                    slot_available[slot] = False
    return slot_available




@router.post("/getAvailableAppointment")
def get_available_appointment(check_available_appointment: get_available_appointment , db: Session = Depends(get_db)):
    details = []

    if check_available_appointment.doctor_id == 0:
        print(hash_lookup(check_available_appointment.specialty))
        doctors_db = db.query(Doctor).filter(Doctor.doctor_specialty_hash == hash_lookup(check_available_appointment.specialty),
                                             Doctor.is_doctor == 1,
                                             or_(check_available_appointment.date < Doctor.status_expiry,
                                                 Doctor.status_expiry == None)
                                              ).all()
    else:
        doctors_db = db.query(Doctor).filter(Doctor.doctor_id == check_available_appointment.doctor_id,
                                             or_(check_available_appointment.date < Doctor.status_expiry,
                                                 Doctor.status_expiry == None)
                                            ).all()

    for doctor in doctors_db:
        doctor_name = get_doctor_name_by_id(doctor.doctor_id,db)
        slot_available = {1: True, 2: True, 3: True}        # by default all 3 slots will be vacant
        app_data = {
            "doctor_name": doctor_name,
            "time_slot": slot_available,
            "doctor_id": doctor.doctor_id
        }
        
        # query appointment based on doctor_id and the date 
        appointments_db = db.query(Appointment).filter(Appointment.doctor_id == doctor.doctor_id,
                                                    Appointment.date_time >= datetime.combine(check_available_appointment.date, datetime.min.time()),  # Convert date to datetime
                                                    Appointment.date_time < datetime.combine(check_available_appointment.date, datetime.max.time())).all()
    
        if not appointments_db:     # if there is no appointment on that date, so 3 slots are vacant
            details.append(app_data)
            continue
    
        for appointment in appointments_db:     # if there is appointment on the date
            slot = split_time_to_slot(appointment.date_time)
            if appointment.status != "CANCELLED":       # if the slot is not cancelled then it is reserved
                slot_available[slot] = False
        details.append(app_data)

    info = {
         "specialty": check_available_appointment.specialty,
         "date": check_available_appointment.date,
         "details": details
    }
    return info



def get_doctor_id_by_username(username:str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username_hash == hash_lookup(username), User.is_valid == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail=doctor_not_found)
    doctor = db.query(Doctor).filter(Doctor.user_id== user.user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail=doctor_not_found)
    return doctor.doctor_id
    
    
@router.post("/CreateNewAppointment/")
def create_appointment(user_data: create_new_appointment, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role_hash == admin_hash:
        patient_id = user_data.patient_id
        # check if patient is still valid
        patient_in_db = db.query(Patient).filter(Patient.patient_id==patient_id).first()
        if patient_in_db.is_patient == 0:
            return patient_not_found
    elif current_user.role_hash == patient_hash:
        patient_id = get_patient_id_by_user_id(current_user.user_id,db)
    elif current_user.role_hash == doctor_hash:
        patient_id = user_data.patient_id
    doctor_id =  user_data.doctor_id
    date_time = combine_date_time_slot(user_data.date, user_data.time_slot)

    # check if expiry status is before appointment -> invalid appointment
    patient_expired_date = get_patient_status_expiry_by_id(patient_id, db)
    if patient_expired_date and date_time > patient_expired_date:
        return expired_before_appoinment
    
    # check if that slot is passed
    if date_time < datetime.now():
        return appointment_invalid
    

    # check if that slot is already reserved
    appointments_db = db.query(Appointment).filter(Appointment.doctor_id == doctor_id,
                                                    Appointment.date_time >= datetime.combine(user_data.date, datetime.min.time()),  # Convert date to datetime
                                                    Appointment.date_time < datetime.combine(user_data.date, datetime.max.time())).all()
    if appointments_db:
        for appointment in appointments_db:
            if split_time_to_slot(appointment.date_time) == user_data.time_slot and appointment.status != "CANCELLED":
                return appointment_reserved
    
    # create new appointment
    new_appointment = Appointment(patient_id = patient_id, doctor_id= doctor_id, description = encrypt(user_data.description), date_time =  date_time)
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return appointment_created


