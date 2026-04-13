from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from backend.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    fitness_level = Column(String, nullable=True)
    injuries = Column(String, nullable=True)
