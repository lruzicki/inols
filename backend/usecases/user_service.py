from typing import Optional, List
from domain.user import User
from domain.interfaces import UserRepository, AuthService

class UserService:
    """Serwis użytkowników - logika biznesowa"""
    
    def __init__(self, user_repository: UserRepository, auth_service: AuthService):
        self.user_repository = user_repository
        self.auth_service = auth_service
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Pobiera użytkownika po ID"""
        return self.user_repository.get_by_id(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Pobiera użytkownika po email"""
        return self.user_repository.get_by_email(email)
    
    def create_user(self, user: User) -> User:
        """Tworzy nowego użytkownika"""
        # Sprawdź czy użytkownik już istnieje
        existing_user = self.user_repository.get_by_email(user.email)
        if existing_user:
            raise ValueError(f"Użytkownik z emailem {user.email} już istnieje")
        
        return self.user_repository.create_user(user)
    
    def update_user_roles(self, user_id: str, roles: List[str]) -> User:
        """Aktualizuje role użytkownika"""
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise ValueError(f"Użytkownik o ID {user_id} nie istnieje")
        
        user.roles = roles
        return self.user_repository.update_user(user)
    
    def validate_token(self, token: str) -> Optional[User]:
        """Waliduje token i zwraca użytkownika"""
        return self.auth_service.validate_token(token)
    
    def create_token(self, user: User) -> str:
        """Tworzy token dla użytkownika"""
        return self.auth_service.create_token(user)
    
    async def authenticate_with_azure(self, azure_token: str) -> Optional[User]:
        """Autoryzuje użytkownika przez Azure AD"""
        return await self.auth_service.verify_azure_token(azure_token) 