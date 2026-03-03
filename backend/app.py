from fastapi import FastAPI
from pydantic import BaseModel
from backend.services.ai_services import AIService
from backend.services.prompt_builder import PromptBuilder

app = FastAPI()

class GenerateRequest(BaseModel):
    input: str
  

@app.get("/")
def root():
    return {"message": "Coach AI backend running"}

@app.post("/generate")
def generate_workout(request: GenerateRequest):
    user_input = request.input
    ai = AIService()
    messages = PromptBuilder.build_prompt(user_input)
    workout_text = ai.ask(messages)
    return {"workout": workout_text}
