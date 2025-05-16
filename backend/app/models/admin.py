#define the database

from sqlalchemy import Column, Integer, Boolean,DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Admin(Base):
    __tablename__ = "admin"
    admin_id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey('user.user_id'))
    is_admin = Column(Boolean, index=True, default = True) 
    status_expiry = Column (DateTime)
    user = relationship("User", backref="admin")