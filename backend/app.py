from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.services.ai_services import AIService
from backend.services.prompt_builder import PromptBuilder
from backend.services.auth_service import get_current_user
from backend.db.database import get_db
from backend.models.workout import WorkoutHistory
from backend.routes.users import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

class Message(BaseModel):
    role: str
    text: str

class GenerateRequest(BaseModel):
    input: str
    history: list[Message] = []

@app.get("/")
def root():
    return {"message": "Coach AI backend running"}

@app.post("/generate")
def generate_workout(
    request: GenerateRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_input = request.input
    ai = AIService()
    profile = {
        "age": current_user.age,
        "weight": current_user.weight,
        "fitness_level": current_user.fitness_level,
        "injuries": current_user.injuries,
    }
    messages = PromptBuilder.build_prompt(user_input, history=request.history, profile=profile)
    workout_text = ai.ask(messages)

    db.add(WorkoutHistory(user_id=current_user.id, prompt=user_input, response=workout_text))
    db.commit()

    return {"workout": workout_text}

@app.get("/history")
def get_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(WorkoutHistory)
        .filter(WorkoutHistory.user_id == current_user.id)
        .order_by(WorkoutHistory.created_at.desc())
        .all()
    )
    return [
        {"id": r.id, "prompt": r.prompt, "response": r.response, "timestamp": r.created_at}
        for r in records
    ]

@app.delete("/history/{workout_id}")
def delete_workout(
    workout_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(WorkoutHistory).filter(
        WorkoutHistory.id == workout_id,
        WorkoutHistory.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted"}

@app.get("/profile")
def get_profile(current_user=Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "age": current_user.age,
        "weight": current_user.weight,
        "fitness_level": current_user.fitness_level,
        "injuries": current_user.injuries,
    }

class ProfileUpdateRequest(BaseModel):
    age: int | None = None
    weight: float | None = None
    fitness_level: str | None = None
    injuries: str | None = None

@app.put("/profile")
def update_profile(
    request: ProfileUpdateRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.age = request.age
    current_user.weight = request.weight
    current_user.fitness_level = request.fitness_level
    current_user.injuries = request.injuries
    db.commit()
    return {"message": "Profile updated"}
