from pydantic import BaseModel
from datetime import datetime, date

# pydantic model for appointment

class admin_appointment_update(BaseModel):
    id: int  #  appointment_id
    description : str
    date_time : datetime
    status : str

class user_appointment_update(BaseModel):
    id: int #  appointment_id
    description : str
    date_time: datetime
    status: str

class get_available_appointment(BaseModel):
    doctor_id: int
    specialty: str
    date: date
    
class get_available_appointment_by_appointmentId(BaseModel):
    appointment_id: int
    date: date
    
class create_new_appointment(BaseModel):
    patient_id: int 
    date: date
    doctor_id: int
    time_slot: int
    description: str
