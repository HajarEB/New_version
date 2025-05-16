from sqlalchemy import Column, Integer, String,DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Appointment(Base):
    __tablename__ = "appointment"
    
    appointment_id = Column(Integer, primary_key = True, index = True)
    patient_id = Column(Integer, ForeignKey('patient.patient_id'))
    doctor_id = Column(Integer, ForeignKey('doctor.doctor_id'))
    description = Column(String, index=True)
    date_time = Column(DateTime, nullable=False)
    status = Column(String, index=True, default = "SCHEDULED")
    
    doctor = relationship("Doctor", back_populates="appointment")
    patient = relationship("Patient", back_populates="appointment")