from sqlalchemy import Column, Integer, Boolean,DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = "patient"
    patient_id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey('user.user_id'))
    status_expiry = Column (DateTime)
    is_patient = Column(Boolean, index=True, default = True) 
    
    user = relationship("User", backref="patient")
    appointment = relationship("Appointment", back_populates="patient") 
   
        