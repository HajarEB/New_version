from pydantic import BaseModel

class token(BaseModel):
    access_token: str
    token_type: str

class token_data(BaseModel):
    user_id: int | None = None

class token_value(BaseModel):
    token: str