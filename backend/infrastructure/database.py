from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from infrastructure.db_models import Base

import os

# Konfiguracja bazy danych
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ino_user:ino_password@localhost:5432/ino_db")

# Tworzenie engine
engine = create_engine(DATABASE_URL)

# Tworzenie sesji
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency do pobierania sesji bazy danych"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Tworzy tabele w bazie danych"""
    Base.metadata.create_all(bind=engine) 