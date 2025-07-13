from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class User:
    """Model użytkownika w warstwie domain"""
    id: str
    email: str
    name: str
    roles: List[str]
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def has_role(self, role: str) -> bool:
        """Sprawdza czy użytkownik ma określoną rolę"""
        return role in self.roles

    def has_any_role(self, roles: List[str]) -> bool:
        """Sprawdza czy użytkownik ma którąkolwiek z określonych ról"""
        return any(role in self.roles for role in roles) 