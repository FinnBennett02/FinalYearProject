from fastapi import FastAPI
from pydantic import BaseModel
from backend.services.ai_services import AIService
from backend.services.prompt_builder import PromptBuilder

app = FastAPI()

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
