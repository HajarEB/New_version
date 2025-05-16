from pydantic import BaseModel

class user(BaseModel):
    username: str
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone_number: str | None = None

# Pydantic models for create new user
class user_create(user):
    password: str


# pydantic model for updating user
class user_update(BaseModel):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone_number: str | None = None
    doctor_specialty: str | None = None # only user for doctors update

