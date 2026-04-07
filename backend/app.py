from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.services.ai_services import AIService
from backend.services.prompt_builder import PromptBuilder
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
def generate_workout(request: GenerateRequest):
    user_input = request.input
    ai = AIService()
    messages = PromptBuilder.build_prompt(user_input, history=request.history)
    workout_text = ai.ask(messages)
    return {"workout": workout_text}
