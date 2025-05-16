# includes pydantic models
from datetime import datetime
from pydantic import BaseModel
from schemas.user import user_create   

class admin_user(user_create):
    is_admin: bool
    user_id: int

# pydantic model for updating role
class role_update(BaseModel):
    user_id: int
    new_role: str
    
class default_admin_update_admin(BaseModel):
    id: int #admin_id
    status_expiry : datetime | None = None
