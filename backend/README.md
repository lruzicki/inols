# INO Backend API

Backend API dla systemu Impreza na Orientację zbudowany w FastAPI z Clean Architecture.

## 🏗️ Architektura

Projekt używa Clean Architecture z następującymi warstwami:

### 1. **Domain** (`domain/`)
- Czyste klasy biznesowe bez zależności od frameworków
- `Event` - reprezentuje wydarzenie
- `Result` - reprezentuje wynik

### 2. **Use Cases** (`usecases/`)
- Logika aplikacji - co można zrobić z danymi
- `EventService` - operacje na wydarzeniach
- `ResultService` - operacje na wynikach

### 3. **Repository** (`repositories/`)
- Komunikacja z bazą danych
- `SqlAlchemyEventRepository` - operacje DB dla wydarzeń
- `SqlAlchemyResultRepository` - operacje DB dla wyników

### 4. **Infrastructure** (`infrastructure/`)
- Modele bazy danych (SQLAlchemy)
- Konfiguracja bazy danych

## 🚀 Uruchomienie

### Z Docker Compose (zalecane)

```bash
# Uruchom całą aplikację
docker-compose up --build

# API będzie dostępne na: http://localhost:8000
# Dokumentacja API: http://localhost:8000/docs
```

### Lokalnie

```bash
# Zainstaluj zależności
pip install -r requirements.txt

# Uruchom PostgreSQL (lub użyj Docker)
docker run -d --name postgres \
  -e POSTGRES_DB=ino_db \
  -e POSTGRES_USER=ino_user \
  -e POSTGRES_PASSWORD=ino_password \
  -p 5432:5432 \
  postgres:15

# Uruchom aplikację
uvicorn main:app --reload
```

## 📋 Endpointy API

### Wydarzenia (Events)

- `POST /events` - Tworzy nowe wydarzenie
- `GET /events` - Listuje wszystkie aktywne wydarzenia
- `DELETE /events/{event_id}` - Usuwa wydarzenie (soft delete)

### Wyniki (Results)

- `POST /results` - Dodaje nowy wynik
- `GET /results/{event_id}` - Listuje wyniki dla wydarzenia
- `DELETE /results/{result_id}` - Usuwa wynik (soft delete)

### Inne

- `GET /health` - Sprawdza status API

## 📊 Struktura bazy danych

### Tabela `events`
- `id` - ID wydarzenia
- `name` - Nazwa wydarzenia
- `date` - Data wydarzenia
- `categories` - Kategorie (JSON)
- `location` - Lokalizacja
- `start_point_url` - URL punktu startowego
- `start_time` - Godzina startu
- `fee` - Opłata (opcjonalne)
- `registration_deadline` - Deadline rejestracji
- `deleted` - Flaga usunięcia

### Tabela `results`
- `id` - ID wyniku
- `event_id` - ID wydarzenia (FK)
- `category` - Kategoria
- `team` - Nazwa zespołu
- `penalty_points` - Punkty karne
- `deleted` - Flaga usunięcia

## 🧪 Przykłady użycia

### Tworzenie wydarzenia

```bash
curl -X POST "http://localhost:8000/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "INO Chaszcze 2024",
    "date": "2024-06-15T10:00:00",
    "categories": ["TSZ", "TT", "TU"],
    "location": "Chaszcze, Gdynia",
    "start_point_url": "https://maps.google.com/...",
    "start_time": "10:00",
    "fee": 20.0,
    "registration_deadline": "2024-06-10T23:59:59"
  }'
```

### Dodawanie wyniku

```bash
curl -X POST "http://localhost:8000/results" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": 1,
    "category": "TSZ",
    "team": "Leśna Szkółka",
    "penalty_points": 0
  }'
```

## 📚 Dokumentacja API

Po uruchomieniu aplikacji, dokumentacja Swagger UI jest dostępna pod adresem:
- http://localhost:8000/docs

## 🔧 Konfiguracja

Zmienne środowiskowe:
- `DATABASE_URL` - URL bazy danych PostgreSQL 