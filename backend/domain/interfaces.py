from abc import ABC, abstractmethod
from typing import Optional, List
from .user import User

class UserRepository(ABC):
    """Interfejs repozytorium użytkowników"""
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        """Pobiera użytkownika po email"""
        pass
    
    @abstractmethod
    def get_by_id(self, user_id: str) -> Optional[User]:
        """Pobiera użytkownika po ID"""
        pass
    
    @abstractmethod
    def create_user(self, user: User) -> User:
        """Tworzy nowego użytkownika"""
        pass
    
    @abstractmethod
    def update_user(self, user: User) -> User:
        """Aktualizuje użytkownika"""
        pass

class AuthService(ABC):
    """Interfejs serwisu autoryzacji"""
    
    @abstractmethod
    def validate_token(self, token: str) -> Optional[User]:
        """Waliduje token JWT i zwraca użytkownika"""
        pass
    
    @abstractmethod
    def create_token(self, user: User) -> str:
        """Tworzy token JWT dla użytkownika"""
        pass
    
    @abstractmethod
    def verify_azure_token(self, token: str) -> Optional[User]:
        """Weryfikuje token Azure AD i zwraca użytkownika"""
        pass 