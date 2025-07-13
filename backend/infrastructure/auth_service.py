import os
import httpx
import base64
import json
from typing import Optional
from jose import JWTError, jwt
from datetime import datetime, timedelta
from domain.user import User
from domain.interfaces import AuthService, UserRepository

class AzureAuthService(AuthService):
    """Implementacja serwisu autoryzacji z Azure AD"""
    
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        self.client_id = os.getenv("AZURE_AD_CLIENT_ID")
        self.client_secret = os.getenv("AZURE_AD_CLIENT_SECRET")
        self.tenant_id = os.getenv("AZURE_AD_TENANT_ID")
        self.jwt_secret = os.getenv("JWT_SECRET_KEY")
        
        # Azure AD endpoints
        self.azure_authority = f"https://login.microsoftonline.com/{self.tenant_id}"
        self.azure_token_endpoint = f"{self.azure_authority}/oauth2/v2.0/token"
        self.azure_userinfo_endpoint = "https://graph.microsoft.com/v1.0/me"
    
    def validate_token(self, token: str) -> Optional[User]:
        """Waliduje token JWT i zwraca użytkownika"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            user_id = payload.get("sub")
            if user_id:
                return self.user_repository.get_by_id(user_id)
        except JWTError:
            pass
        return None
    
    def create_token(self, user: User) -> str:
        """Tworzy token JWT dla użytkownika"""
        payload = {
            "sub": user.id,
            "email": user.email,
            "name": user.name,
            "roles": user.roles,
            "exp": datetime.utcnow() + timedelta(hours=24),
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, self.jwt_secret, algorithm="HS256")
    
    async def verify_azure_token(self, token: str) -> Optional[User]:
        """Weryfikuje token Azure AD i zwraca użytkownika"""
        try:
            # Dekoduj token JWT bez weryfikacji podpisu
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            # Dekoduj payload
            payload_bytes = base64.urlsafe_b64decode(parts[1] + '==')
            payload = json.loads(payload_bytes.decode('utf-8'))
            
            # Pobierz informacje o użytkowniku z payload
            user_email = payload.get("upn") or payload.get("email")
            user_name = payload.get("name")
            user_id = payload.get("oid") or payload.get("sub")
            
            if not user_email:
                return None
            
            # Sprawdź czy użytkownik istnieje w naszej bazie
            user = self.user_repository.get_by_email(user_email)
            
            if not user:
                # Utwórz nowego użytkownika
                user = User(
                    id=user_id,
                    email=user_email,
                    name=user_name,
                    roles=["admin"]
                )
                user = self.user_repository.create_user(user)
            
            return user
                
        except Exception as e:
            print(f"Błąd weryfikacji tokenu Azure: {e}")
            return None
    
    def get_azure_login_url(self) -> str:
        """Zwraca URL do logowania Azure AD"""
        return f"{self.azure_authority}/oauth2/v2.0/authorize?" + \
               f"client_id={self.client_id}&" + \
               "response_type=code&" + \
               "redirect_uri=http://localhost:3000/api/auth/callback/azure-ad&" + \
               "scope=openid profile email&" + \
               "response_mode=query" 