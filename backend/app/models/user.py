from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    
    username = Column(String, unique=True, index=True)
    username_hash = Column(String, nullable=False, index=True)
    
    email = Column(String, unique=True, index=True)
    email_hash = Column(String, nullable=False, index=True)
    
    phone_number =  Column(String, index=True, unique=True)
    phone_number_hash = Column(String, nullable=False, index=True)
    
    hashed_password = Column(String)
    
    role = Column(String, nullable=False, index=True)
    role_hash = Column(String, nullable=False, index=True)
    
    is_valid = Column(Boolean, index=True, default = True)
    
    