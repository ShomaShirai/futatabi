from typing import Optional

from pydantic import BaseModel, EmailStr


class AuthMeResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    is_active: bool
    firebase_uid: Optional[str] = None
