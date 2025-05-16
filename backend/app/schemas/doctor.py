from datetime import datetime

from pydantic import BaseModel
from schemas.user import user_create

class doctor_user(user_create):
    user_id: int
    doctor_specialty: str
    
    
class admin_update_doctor(BaseModel):
    id:int #doctor_id
    status_expiry : datetime | None = None