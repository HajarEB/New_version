from sqlalchemy import Column, Integer, String, DateTime

from database import Base

class TokenBlacklist(Base):
    __tablename__ = "tokenBlacklist"
    token_id = Column(Integer, primary_key = True, index = True)
    access_token = Column(String, unique=True, nullable=False)
    expired_at = Column (DateTime)

    
    