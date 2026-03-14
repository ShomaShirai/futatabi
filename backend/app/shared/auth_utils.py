from datetime import datetime, timedelta
from typing import Optional
import hashlib
import secrets
from jose import JWTError, jwt
from app.shared.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Extract salt and hash from stored password
        if ':' not in hashed_password:
            return False
            
        salt, stored_hash = hashed_password.split(':', 1)
        
        # Hash the provided password with the same salt
        password_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
        computed_hash = password_hash.hex()
        
        return computed_hash == stored_hash
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2 with a random salt"""
    # Generate a random salt
    salt = secrets.token_hex(16)
    
    # Hash the password with the salt
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    computed_hash = password_hash.hex()
    
    # Return salt:hash format
    return f"{salt}:{computed_hash}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def verify_token(token: str):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None 