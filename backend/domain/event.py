from datetime import datetime
from typing import List, Optional

class Event:
    """
    Klasa Event - reprezentuje wydarzenie w systemie.
    To jest "czysta" klasa biznesowa - nie zależy od żadnych frameworków.
    """
    
    def __init__(
        self,
        name: str,
        date: datetime,
        categories: List[str],
        location: str,
        start_point_url: str,
        start_time: str,
        fee: Optional[float] = None,
        registration_deadline: Optional[datetime] = None,
        registered_participants: int = 0,
        google_maps_url: Optional[str] = None,
        google_drive_url: Optional[str] = None,
        deleted: bool = False,
        id: Optional[int] = None,
    ):
        self.id = id
        self.name = name
        self.date = date
        self.categories = categories
        self.location = location
        self.start_point_url = start_point_url
        self.start_time = start_time
        self.fee = fee
        self.registration_deadline = registration_deadline
        self.registered_participants = registered_participants
        self.google_maps_url = google_maps_url
        self.google_drive_url = google_drive_url
        self.deleted = deleted
    
    def is_registration_open(self) -> bool:
        """Sprawdza czy rejestracja jest jeszcze otwarta"""
        if not self.registration_deadline:
            return True
        return datetime.now() < self.registration_deadline
    
    def is_deleted(self) -> bool:
        """Sprawdza czy wydarzenie jest usunięte"""
        return self.deleted 