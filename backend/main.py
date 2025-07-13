from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime

# Importy z naszych warstw
from infrastructure.database import get_db, create_tables
from repositories.event_repository import SqlAlchemyEventRepository
from repositories.result_repository import SqlAlchemyResultRepository
from repositories.user_repository import SqlAlchemyUserRepository
from usecases.event_service import EventService
from usecases.result_service import ResultService
from usecases.user_service import UserService
from domain.event import Event
from domain.result import Result
from schemas import EventCreate, EventResponse, ResultCreate, ResultResponse, UserResponse, TokenResponse, AzureLoginRequest, LoginResponse
from infrastructure.auth_service import AzureAuthService
from middleware.auth_middleware import get_current_user, require_roles, require_admin
from domain.user import User

# Tworzenie aplikacji FastAPI
app = FastAPI(
    title="INO API",
    description="API dla systemu Impreza na Orientację",
    version="1.0.0"
)

# Konfiguracja CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://ino.lesnaszkolka.org",
        "https://test.lesnaszkolka.org"
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Wszystkie metody HTTP
    allow_headers=["*"],  # Wszystkie nagłówki
)

# Tworzenie tabel przy starcie
@app.on_event("startup")
async def startup_event():
    create_tables()

# Dependency injection dla serwisów
def get_event_service(db: Session = Depends(get_db)) -> EventService:
    repository = SqlAlchemyEventRepository(db)
    return EventService(repository)

def get_result_service(db: Session = Depends(get_db)) -> ResultService:
    repository = SqlAlchemyResultRepository(db)
    return ResultService(repository)

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    user_repository = SqlAlchemyUserRepository(db)
    auth_service = AzureAuthService(user_repository)
    return UserService(user_repository, auth_service)

def get_auth_service(db: Session = Depends(get_db)) -> AzureAuthService:
    user_repository = SqlAlchemyUserRepository(db)
    return AzureAuthService(user_repository)

# Endpointy autoryzacji
@app.post("/auth/azure-login", response_model=LoginResponse)
async def azure_login(
    login_data: AzureLoginRequest,
    user_service: UserService = Depends(get_user_service)
):
    """Logowanie przez Azure AD"""
    try:
        # Tutaj implementacja wymiany kodu na token Azure AD
        # To jest uproszczona wersja - w rzeczywistości potrzebujesz wymiany kodu na token
        user = await user_service.authenticate_with_azure(login_data.code)
        
        if user:
            token = user_service.create_token(user)
            return LoginResponse(
                success=True,
                message="Zalogowano pomyślnie",
                token=token,
                user=UserResponse(
                    id=user.id,
                    email=user.email,
                    name=user.name,
                    roles=user.roles,
                    is_active=user.is_active,
                    created_at=user.created_at.isoformat() if user.created_at else None,
                    updated_at=user.updated_at.isoformat() if user.updated_at else None
                )
            )
        else:
            return LoginResponse(
                success=False,
                message="Błąd autoryzacji Azure AD"
            )
    except Exception as e:
        return LoginResponse(
            success=False,
            message=f"Błąd logowania: {str(e)}"
        )

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Pobiera informacje o aktualnym użytkowniku"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        roles=current_user.roles,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None,
        updated_at=current_user.updated_at.isoformat() if current_user.updated_at else None
    )

# Endpointy dla Event
@app.post("/events", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    event_service: EventService = Depends(get_event_service),
    current_user: User = Depends(get_current_user)
):
    """Tworzy nowe wydarzenie (wymaga zalogowania)"""
    try:
        # Konwertuj stringi na datetime dla domain object
        event_date = datetime.strptime(event_data.date, "%Y-%m-%d")
        registration_deadline = None
        if event_data.registration_deadline:
            registration_deadline = datetime.strptime(event_data.registration_deadline, "%Y-%m-%d")
        
        # Konwertuj Pydantic model na domain object
        event = Event(
            name=event_data.name,
            date=event_date,
            categories=event_data.categories,
            location=event_data.location,
            start_point_url=event_data.start_point_url,
            start_time=event_data.start_time,
            fee=event_data.fee,
            registration_deadline=registration_deadline,
            registered_participants=event_data.registered_participants or 0,
            google_maps_url=event_data.google_maps_url,
            google_drive_url=event_data.google_drive_url
        )
        
        created_event = event_service.create_event(event)
        
        # Konwertuj z powrotem na response model
        return EventResponse(
            id=created_event.id,
            name=created_event.name,
            date=created_event.date.strftime("%Y-%m-%d"),
            categories=created_event.categories,
            location=created_event.location,
            start_point_url=created_event.start_point_url,
            start_time=created_event.start_time,
            fee=created_event.fee,
            registration_deadline=created_event.registration_deadline.strftime("%Y-%m-%d") if created_event.registration_deadline else None,
            registered_participants=created_event.registered_participants,
            google_maps_url=created_event.google_maps_url,
            google_drive_url=created_event.google_drive_url,
            deleted=created_event.deleted,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/events", response_model=List[EventResponse])
def list_events(
    event_service: EventService = Depends(get_event_service)
):
    """Listuje najnowsze 3 aktywne wydarzenia posortowane po dacie"""
    events = event_service.list_latest_events(3)
    
    # Konwertuj na response models
    return [
        EventResponse(
            id=event.id,
            name=event.name,
            date=event.date.strftime("%Y-%m-%d"),
            categories=event.categories,
            location=event.location,
            start_point_url=event.start_point_url,
            start_time=event.start_time,
            fee=event.fee,
            registration_deadline=event.registration_deadline.strftime("%Y-%m-%d") if event.registration_deadline else None,
            registered_participants=event.registered_participants,
            google_maps_url=event.google_maps_url,
            google_drive_url=event.google_drive_url,
            deleted=event.deleted,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        for event in events
    ]

@app.get("/events/all", response_model=List[EventResponse])
def list_all_events(
    event_service: EventService = Depends(get_event_service)
):
    """Listuje wszystkie aktywne wydarzenia posortowane po dacie"""
    events = event_service.list_events()
    
    # Konwertuj na response models
    return [
        EventResponse(
            id=event.id,
            name=event.name,
            date=event.date.strftime("%Y-%m-%d"),
            categories=event.categories,
            location=event.location,
            start_point_url=event.start_point_url,
            start_time=event.start_time,
            fee=event.fee,
            registration_deadline=event.registration_deadline.strftime("%Y-%m-%d") if event.registration_deadline else None,
            registered_participants=event.registered_participants,
            google_maps_url=event.google_maps_url,
            google_drive_url=event.google_drive_url,
            deleted=event.deleted,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        for event in events
    ]

@app.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_data: EventCreate,
    event_service: EventService = Depends(get_event_service),
    current_user: User = Depends(get_current_user)  # Sprawdza tylko czy użytkownik jest zalogowany
):
    """Aktualizuje wydarzenie (wymaga zalogowania)"""
    try:
        # Konwertuj stringi na datetime dla domain object
        event_date = datetime.strptime(event_data.date, "%Y-%m-%d")
        registration_deadline = None
        if event_data.registration_deadline:
            registration_deadline = datetime.strptime(event_data.registration_deadline, "%Y-%m-%d")
        
        # Konwertuj Pydantic model na domain object
        event = Event(
            name=event_data.name,
            date=event_date,
            categories=event_data.categories,
            location=event_data.location,
            start_point_url=event_data.start_point_url,
            start_time=event_data.start_time,
            fee=event_data.fee,
            registration_deadline=registration_deadline,
            registered_participants=event_data.registered_participants or 0,
            google_maps_url=event_data.google_maps_url,
            google_drive_url=event_data.google_drive_url
        )
        
        updated_event = event_service.update_event(event_id, event)
        
        if not updated_event:
            raise HTTPException(status_code=404, detail="Wydarzenie nie zostało znalezione")
        
        # Konwertuj z powrotem na response model
        return EventResponse(
            id=updated_event.id,
            name=updated_event.name,
            date=updated_event.date.strftime("%Y-%m-%d"),
            categories=updated_event.categories,
            location=updated_event.location,
            start_point_url=updated_event.start_point_url,
            start_time=updated_event.start_time,
            fee=updated_event.fee,
            registration_deadline=updated_event.registration_deadline.strftime("%Y-%m-%d") if updated_event.registration_deadline else None,
            registered_participants=updated_event.registered_participants,
            google_maps_url=updated_event.google_maps_url,
            google_drive_url=updated_event.google_drive_url,
            deleted=updated_event.deleted,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/events/{event_id}")
def delete_event(
    event_id: int,
    event_service: EventService = Depends(get_event_service),
    current_user: User = Depends(require_admin)
):
    """Usuwa wydarzenie (wymaga roli admin)"""
    try:
        success = event_service.delete_event(event_id)
        if success:
            return {"message": f"Wydarzenie {event_id} zostało usunięte"}
        else:
            raise HTTPException(status_code=404, detail="Wydarzenie nie zostało znalezione")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpointy dla Result
@app.post("/results", response_model=ResultResponse)
async def create_result(
    result_data: ResultCreate,
    result_service: ResultService = Depends(get_result_service),
    current_user: User = Depends(get_current_user)  # Sprawdza tylko czy użytkownik jest zalogowany
):
    """Dodaje nowy wynik (wymaga zalogowania)"""
    try:
        # Konwertuj Pydantic model na domain object
        result = Result(
            event_id=result_data.event_id,
            category=result_data.category,
            team=result_data.team,
            penalty_points=result_data.penalty_points
        )
        
        created_result = result_service.add_result(result)
        
        # Konwertuj z powrotem na response model
        return ResultResponse(
            id=created_result.id,
            event_id=created_result.event_id,
            category=created_result.category,
            team=created_result.team,
            penalty_points=created_result.penalty_points,
            deleted=created_result.deleted,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/results/{event_id}")
def get_results_by_event(
    event_id: int,
    result_service: ResultService = Depends(get_result_service)
):
    """Listuje wyniki dla wydarzenia pogrupowane według kategorii"""
    results_by_category = result_service.list_results_by_event(event_id)
    
    # Konwertuj na format odpowiedzi pogrupowany według kategorii
    response = {}
    for category, results in results_by_category.items():
        response[category] = [
            {
                "id": result.id,
                "event_id": result.event_id,
                "category": result.category,
                "team": result.team,
                "penalty_points": result.penalty_points,
                "deleted": result.deleted,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            for result in results
        ]
    
    return response

@app.put("/results/{event_id}")
async def update_results_for_event(
    event_id: int,
    results_data: dict,
    result_service: ResultService = Depends(get_result_service),
    current_user: User = Depends(get_current_user)  # Sprawdza tylko czy użytkownik jest zalogowany
):
    """Aktualizuje wszystkie wyniki dla wydarzenia (wymaga zalogowania)"""
    try:
        # Usuń wszystkie istniejące wyniki dla tego wydarzenia
        result_service.delete_all_results_for_event(event_id)
        
        # Dodaj nowe wyniki
        for category, results in results_data.items():
            for result_item in results:
                if result_item.get('team', '').strip():  # Tylko jeśli zespół nie jest pusty
                    result = Result(
                        event_id=event_id,
                        category=category,
                        team=result_item['team'],
                        penalty_points=result_item.get('penalty_points', 0)
                    )
                    result_service.add_result(result)
        
        return {"message": f"Wyniki dla wydarzenia {event_id} zostały zaktualizowane"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/results/{result_id}")
def delete_result(
    result_id: int,
    result_service: ResultService = Depends(get_result_service),
    current_user: User = Depends(require_admin)
):
    """Usuwa wynik (wymaga roli admin)"""
    try:
        success = result_service.delete_result(result_id)
        if success:
            return {"message": f"Wynik {result_id} został usunięty"}
        else:
            raise HTTPException(status_code=404, detail="Wynik nie został znaleziony")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Health check endpoint
@app.get("/health")
def health_check():
    """Sprawdza czy API działa"""
    return {"status": "healthy", "message": "INO API działa poprawnie"} 