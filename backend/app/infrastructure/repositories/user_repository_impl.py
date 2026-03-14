from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.database.models import UserModel


class UserRepositoryImpl(UserRepository):
    """User repository implementation"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def create(self, user: User) -> User:
        """Create a new user"""
        db_user = UserModel(
            email=user.email,
            username=user.username,
            hashed_password=user.hashed_password,
            is_active=user.is_active
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return self._to_entity(db_user)
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        db_user = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        return self._to_entity(db_user) if db_user else None
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        db_user = self.db.query(UserModel).filter(UserModel.email == email).first()
        return self._to_entity(db_user) if db_user else None
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        db_user = self.db.query(UserModel).filter(UserModel.username == username).first()
        return self._to_entity(db_user) if db_user else None
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        db_users = self.db.query(UserModel).offset(skip).limit(limit).all()
        return [self._to_entity(db_user) for db_user in db_users]
    
    async def update(self, user: User) -> User:
        """Update user"""
        db_user = self.db.query(UserModel).filter(UserModel.id == user.id).first()
        if not db_user:
            raise ValueError(f"User with ID {user.id} not found")
        
        db_user.email = user.email
        db_user.username = user.username
        db_user.hashed_password = user.hashed_password
        db_user.is_active = user.is_active
        db_user.updated_at = user.updated_at
        
        self.db.commit()
        self.db.refresh(db_user)
        return self._to_entity(db_user)
    
    async def delete(self, user_id: int) -> bool:
        """Delete user"""
        db_user = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        if not db_user:
            return False
        
        self.db.delete(db_user)
        self.db.commit()
        return True
    
    async def exists_by_email(self, email: str) -> bool:
        """Check if user exists by email"""
        return self.db.query(UserModel).filter(UserModel.email == email).first() is not None
    
    async def exists_by_username(self, username: str) -> bool:
        """Check if user exists by username"""
        return self.db.query(UserModel).filter(UserModel.username == username).first() is not None
    
    def _to_entity(self, db_user: UserModel) -> User:
        """Convert SQLAlchemy model to domain entity"""
        return User(
            id=db_user.id,
            email=db_user.email,
            username=db_user.username,
            hashed_password=db_user.hashed_password,
            is_active=db_user.is_active,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at
        ) 