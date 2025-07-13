from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Schematy dla Event
class EventCreate(BaseModel):
    name: str
    date: str  # Format: "2024-06-15"
    categories: List[str]
    location: str
    start_point_url: str
    start_time: str  # Format: "10:00"
    fee: Optional[float] = None
    registration_deadline: Optional[str] = None  # Format: "2024-06-10"
    registered_participants: Optional[int] = 0
    google_maps_url: Optional[str] = None
    google_drive_url: Optional[str] = None

class EventResponse(BaseModel):
    id: int
    name: str
    date: str
    categories: List[str]
    location: str
    start_point_url: str
    start_time: str
    fee: Optional[float] = None
    registration_deadline: Optional[str] = None
    registered_participants: int = 0
    google_maps_url: Optional[str] = None
    google_drive_url: Optional[str] = None
    deleted: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

# Schematy dla Result
class ResultCreate(BaseModel):
    event_id: int
    category: str
    team: str
    penalty_points: int = 0

class ResultResponse(BaseModel):
    id: int
    event_id: int
    category: str
    team: str
    penalty_points: int
    deleted: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class ResultsByCategoryResponse(BaseModel):
    category: str
    results: List[ResultResponse] 

# Schematy dla autoryzacji
class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    roles: List[str]
    is_active: bool
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AzureLoginRequest(BaseModel):
    code: str
    state: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[UserResponse] = None 