from sqlalchemy.orm import Session
from infrastructure.db_models import EventModel
from domain.event import Event
import json
from typing import List, Optional

class SqlAlchemyEventRepository:
    """
    EventRepository - komunikuje się z bazą danych.
    To jest warstwa Repository - mówi JAK zapisujemy dane.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def add(self, event: Event) -> Event:
        """Dodaje nowe wydarzenie do bazy danych"""
        db_event = EventModel(
            name=event.name,
            date=event.date,
            categories=json.dumps(event.categories),
            location=event.location,
            start_point_url=event.start_point_url,
            start_time=event.start_time,
            fee=event.fee,
            registration_deadline=event.registration_deadline,
            registered_participants=event.registered_participants,
            google_maps_url=event.google_maps_url,
            google_drive_url=event.google_drive_url,
        )
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        
        # Konwertuj z powrotem na domain object
        return self._to_domain(db_event)

    def soft_delete(self, event_id: int) -> bool:
        """Usuwa wydarzenie (soft delete)"""
        event = self.db.query(EventModel).filter(EventModel.id == event_id).first()
        if event:
            event.deleted = True
            self.db.commit()
            return True
        return False

    def list_all_sorted(self) -> List[Event]:
        """Listuje wszystkie aktywne wydarzenia posortowane po dacie"""
        events = self.db.query(EventModel).filter_by(deleted=False).order_by(EventModel.date).all()
        return [self._to_domain(event) for event in events]
    
    def list_latest_events(self, limit: int = 3) -> List[Event]:
        """Listuje najnowsze aktywne wydarzenia posortowane po dacie (domyślnie 3)"""
        events = self.db.query(EventModel).filter_by(deleted=False).order_by(EventModel.date.desc()).limit(limit).all()
        return [self._to_domain(event) for event in events]
    
    def get_by_id(self, event_id: int) -> Optional[Event]:
        """Pobiera wydarzenie po ID"""
        event = self.db.query(EventModel).filter(EventModel.id == event_id, EventModel.deleted == False).first()
        return self._to_domain(event) if event else None
    
    def _to_domain(self, db_event: EventModel) -> Event:
        """Konwertuje model bazy danych na domain object"""
        return Event(
            id=db_event.id,
            name=db_event.name,
            date=db_event.date,
            categories=json.loads(db_event.categories),
            location=db_event.location,
            start_point_url=db_event.start_point_url,
            start_time=db_event.start_time,
            fee=db_event.fee,
            registration_deadline=db_event.registration_deadline,
            registered_participants=db_event.registered_participants,
            google_maps_url=db_event.google_maps_url,
            google_drive_url=db_event.google_drive_url,
            deleted=db_event.deleted
        ) 