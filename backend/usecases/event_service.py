from typing import List, Optional
from domain.event import Event

class EventService:
    """
    EventService - zawiera logikę biznesową dla operacji na wydarzeniach.
    To jest warstwa Use Cases - mówi CO można zrobić z danymi.
    """
    
    def __init__(self, event_repository):
        self.event_repository = event_repository

    def create_event(self, event: Event) -> Event:
        """Tworzy nowe wydarzenie"""
        # Tutaj moglibyśmy dodać walidację biznesową
        if not event.name:
            raise ValueError("Nazwa wydarzenia jest wymagana")
        
        return self.event_repository.add(event)

    def delete_event(self, event_id: int) -> bool:
        """Usuwa wydarzenie (soft delete)"""
        return self.event_repository.soft_delete(event_id)

    def list_events(self) -> List[Event]:
        """Listuje wszystkie aktywne wydarzenia posortowane po dacie"""
        return self.event_repository.list_all_sorted()
    
    def list_latest_events(self, limit: int = 3) -> List[Event]:
        """Listuje najnowsze aktywne wydarzenia (domyślnie 3)"""
        return self.event_repository.list_latest_events(limit)
    
    def get_event_by_id(self, event_id: int) -> Optional[Event]:
        """Pobiera wydarzenie po ID"""
        return self.event_repository.get_by_id(event_id) 