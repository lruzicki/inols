from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class EventModel(Base):
    """Model bazy danych dla wydarzeń"""
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    categories = Column(String, nullable=False)  # JSON string
    location = Column(String, nullable=False)
    start_point_url = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    fee = Column(Float, nullable=True)
    registration_deadline = Column(DateTime, nullable=True)
    registered_participants = Column(Integer, default=0)
    google_maps_url = Column(String, nullable=True)
    google_drive_url = Column(String, nullable=True)
    deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ResultModel(Base):
    """Model bazy danych dla wyników"""
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    category = Column(String, nullable=False)
    team = Column(String, nullable=False)
    penalty_points = Column(Integer, default=0)
    deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class UserModel(Base):
    """Model bazy danych dla użytkowników"""
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # Azure AD Object ID
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    roles = Column(Text, nullable=False)  # JSON string z listą ról
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now()) 