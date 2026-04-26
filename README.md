# CoachAI — Plyometric Fitness Assistant

CoachAI is a full-stack AI-powered fitness coaching application specialising in plyometric training. Users register, build a personal profile, and chat with an AI coach that generates structured, personalised workout plans. All workout history is stored per-user in a database and can be reviewed or deleted at any time.

---

## Features

- **AI Chat Interface** — Conversational workout generation powered by GPT-4o-mini. The AI maintains context across the last 10 messages in a session.
- **Personalised Prompts** — User profile data (age, weight, fitness level, injuries) is injected into the system prompt at request time so every response is tailored.
- **Workout History** — All generated workouts are saved to the database and displayed in an expandable history view with timestamps and per-item delete.
- **User Profiles** — Users can set and update their physical profile and upload a profile picture.
- **Authentication** — JWT-based register/login flow with bcrypt password hashing and 24-hour token expiry.
- **Dark / Light Mode** — Full theme toggle persisted across the session.

---

## Tech Stack

**Frontend**
- React 19
- React Router DOM 7
- React Markdown (for formatted AI responses)

**Backend**
- Python / FastAPI
- SQLAlchemy ORM
- SQLite (default) or PostgreSQL via `DATABASE_URL`
- OpenAI API (`gpt-4o-mini`)
- python-jose (JWT), passlib/bcrypt (password hashing)

---

## Project Structure

```
FinalYearProject-1/
├── backend/
│   ├── app.py              # FastAPI app, all routes
│   ├── config.py           # Environment variable loading
│   ├── db/                 # Database connection and session
│   ├── models/             # SQLAlchemy models (User, WorkoutHistory)
│   ├── routes/
│   │   └── users.py        # /auth/register and /auth/login
│   └── services/
│       ├── ai_services.py      # OpenAI API wrapper
│       ├── auth_service.py     # JWT creation and validation
│       └── prompt_builder.py   # Builds personalised message arrays
└── frontend/
    └── src/
        ├── pages/          # ChatPage, HistoryPage, ProfilePage, LoginPage, RegisterPage
        ├── components/     # Sidebar
        └── context/        # AuthContext, ThemeContext
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/generate` | Yes | Generate an AI workout |
| GET | `/history` | Yes | Get all workouts for the logged-in user |
| DELETE | `/history/{id}` | Yes | Delete a specific workout |
| GET | `/profile` | Yes | Get user profile |
| PUT | `/profile` | Yes | Update user profile |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- An OpenAI API key

### Backend

```bash
# From the project root
python -m venv venv
source venv/Scripts/activate   # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r backend/requirements.txt
```

Create a `.env` file in the project root:

```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-long-random-secret
OPENAI_API_KEY=sk-...
```

Run the server:

```bash
uvicorn backend.app:app --reload
```

API available at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm start
```

App available at `http://localhost:3000` (proxied to the backend automatically).

---

## Prompt Engineering

The `PromptBuilder` service constructs a structured message array for each request:

1. **System prompt** — Establishes the AI persona: plyometric specialist, instructed to produce structured and safe workouts.
2. **Profile injection** — Age, weight, fitness level, and injury data are appended to the system prompt dynamically, so the model tailors output without needing the user to repeat themselves.
3. **Conversation history** — The last 10 chat messages are included to maintain session context while keeping token usage bounded.
4. **Sensor data hook** — The user message format supports an optional sensor data field, ready for future integration with jump performance hardware.

---

## Database Schema

**users**
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | Primary key |
| email | String | Unique |
| username | String | Unique |
| hashed_password | String | bcrypt |
| age | Integer | Nullable |
| weight | Float | Nullable |
| fitness_level | String | Nullable |
| injuries | String | Nullable |
| created_at | DateTime | Auto |

**workout_history**
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | Primary key |
| user_id | Integer | FK → users.id |
| prompt | String | User's request |
| response | Text | AI response |
| created_at | DateTime | Auto |
