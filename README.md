Coach A.I — Plyometric Fitness Assistant
Coach A.I is an intelligent fitness coaching system focused on plyometric training. It generates personalised workouts using a custom prompt‑engineering pipeline powered by OpenAI models. The backend is built with FastAPI and designed to be modular, scalable, and ready for future integration with sensor data and a full web interface.

📌 Features
AI‑generated plyometric workouts

Modular backend architecture (services, routing, prompt builder)

FastAPI server with clean API endpoints

Secure environment variable handling

Ready for future expansion into:

IoT jump sensors

Workout history

User profiles

Frontend web interface

📁 Project Structure
Code
FinalYearProject-1/
│
├── backend/
│   ├── app.py                 # FastAPI entry point
│   ├── __init__.py
│   │
│   ├── services/
│   │   ├── ai_service.py      # Handles OpenAI API calls
│   │   ├── prompt_builder.py  # Builds structured prompts
│   │   └── __init__.py
│   │
│   └── routes/                # (Future) API route modules
│
├── frontend/                  # (Future) Web UI
│
├── .gitignore
├── README.md
└── requirements.txt
🧠 AI Workflow
The AI pipeline is built around three components:

1. Prompt Builder
Creates structured prompts that guide the model to behave as a plyometric fitness coach.

2. AI Service
Handles communication with OpenAI’s API and returns model responses.

3. FastAPI Endpoint
Receives user input, builds the prompt, sends it to the AI, and returns the generated workout.

🔌 API Endpoints
POST /generate
Generates a plyometric workout based on user input.

Request Body:

json
{
  "input": "Give me a beginner plyometric workout"
}
Response:

json
{
  "workout": "AI-generated workout text..."
}
🛠️ Technologies Used
Python 3

FastAPI

Uvicorn

OpenAI API

dotenv

HTML/CSS/JavaScript (frontend coming soon)

📦 Installation & Setup
1. Clone the repository
bash
git clone https://github.com/FinnBennett02/FinalYearProject.git
cd FinalYearProject
2. Create and activate a virtual environment
bash
python -m venv venv
venv\Scripts\activate
3. Install dependencies
bash
pip install -r requirements.txt
4. Add your .env file
Create a .env file in the project root:

Code
OPENAI_API_KEY=your_key_here
(This file is ignored by Git for security.)

5. Run the backend
bash
uvicorn backend.app:app --reload
📅 Roadmap
[x] FastAPI backend

[x] AI prompt pipeline

[ ] Frontend webpage

[ ] Workout formatting & structuring

[ ] User profiles & workout history

[ ] IoT sensor integration (jump metrics)

[ ] Real-time adaptive coaching

📚 Academic Context
This project is part of a final-year university submission focusing on:

AI prompt engineering

Modular backend architecture

Real-time data integration

Human–AI interaction design

Performance and scalability considerations

👤 Author
Finn Bennett  
Baldwinstown, Co. Wexford, Ireland
Final Year Project — 2026

If you want, I can also generate:

a requirements.txt

a project logo

a system architecture diagram

a frontend starter template