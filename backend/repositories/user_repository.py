import json
from typing import Optional
from sqlalchemy.orm import Session
from infrastructure.db_models import UserModel
from domain.user import User
from domain.interfaces import UserRepository

class SqlAlchemyUserRepository(UserRepository):
    """Implementacja repozytorium użytkowników z SQLAlchemy"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Pobiera użytkownika po email"""
        user = self.db.query(UserModel).filter_by(email=email, is_active=True).first()
        return self._to_domain(user) if user else None
    
    def get_by_id(self, user_id: str) -> Optional[User]:
        """Pobiera użytkownika po ID"""
        user = self.db.query(UserModel).filter_by(id=user_id, is_active=True).first()
        return self._to_domain(user) if user else None
    
    def create_user(self, user: User) -> User:
        """Tworzy nowego użytkownika"""
        db_user = UserModel(
            id=user.id,
            email=user.email,
            name=user.name,
            roles=json.dumps(user.roles),
            is_active=user.is_active
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return self._to_domain(db_user)
    
    def update_user(self, user: User) -> User:
        """Aktualizuje użytkownika"""
        db_user = self.db.query(UserModel).filter_by(id=user.id).first()
        if not db_user:
            raise ValueError(f"Użytkownik o ID {user.id} nie istnieje")
        
        db_user.email = user.email
        db_user.name = user.name
        db_user.roles = json.dumps(user.roles)
        db_user.is_active = user.is_active
        
        self.db.commit()
        self.db.refresh(db_user)
        return self._to_domain(db_user)
    
    def _to_domain(self, db_user: UserModel) -> User:
        """Konwertuje model bazy danych na domain object"""
        return User(
            id=db_user.id,
            email=db_user.email,
            name=db_user.name,
            roles=json.loads(db_user.roles),
            is_active=db_user.is_active,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at
        ) 