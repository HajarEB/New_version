from datetime import datetime
from pydantic import BaseModel
from schemas.user import user_create

class patient_user(user_create):
    user_id: int
    
class admin_update_patient(BaseModel):
    id: int   #patient_id
    status_expiry : datetime | None = None