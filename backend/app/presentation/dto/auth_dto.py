from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    """Login request DTO"""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Login response DTO"""
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str

class RegisterRequest(BaseModel):
    """Register request DTO"""
    email: EmailStr
    username: str
    password: str

class RegisterResponse(BaseModel):
    """Register response DTO"""
    message: str
    user_id: int
    email: str 