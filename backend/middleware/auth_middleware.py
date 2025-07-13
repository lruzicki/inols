from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from domain.user import User
from usecases.user_service import UserService
from infrastructure.auth_service import AzureAuthService
from repositories.user_repository import SqlAlchemyUserRepository
from infrastructure.database import get_db

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency do pobierania aktualnego użytkownika z tokenu Azure AD"""
    token = credentials.credentials
    
    # Tworzenie serwisów
    user_repository = SqlAlchemyUserRepository(db)
    auth_service = AzureAuthService(user_repository)
    
    # Weryfikuj token Azure AD
    user = await auth_service.verify_azure_token(token)
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Nieprawidłowy token autoryzacji Azure AD"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="Konto użytkownika jest nieaktywne"
        )
    
    return user

def require_roles(required_roles: list[str]):
    """Decorator do sprawdzania ról użytkownika"""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if not current_user.has_any_role(required_roles):
            raise HTTPException(
                status_code=403,
                detail=f"Brak wymaganych ról: {', '.join(required_roles)}"
            )
        return current_user
    return role_checker

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency sprawdzający czy użytkownik jest administratorem"""
    if not current_user.has_role("admin"):
        raise HTTPException(
            status_code=403,
            detail="Wymagane uprawnienia administratora"
        )
    return current_user 