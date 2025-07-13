from typing import Optional

class Result:
    """
    Klasa Result - reprezentuje wynik w systemie.
    To jest "czysta" klasa biznesowa - nie zależy od żadnych frameworków.
    """
    
    def __init__(
        self,
        event_id: int,
        category: str,
        team: str,
        penalty_points: int,
        deleted: bool = False,
        id: Optional[int] = None
    ):
        self.id = id
        self.event_id = event_id
        self.category = category
        self.team = team
        self.penalty_points = penalty_points
        self.deleted = deleted
    
    def is_deleted(self) -> bool:
        """Sprawdza czy wynik jest usunięty"""
        return self.deleted
    
    def has_penalty_points(self) -> bool:
        """Sprawdza czy wynik ma punkty karne"""
        return self.penalty_points > 0 