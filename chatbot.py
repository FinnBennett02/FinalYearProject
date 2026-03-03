from backend.services.ai_service import AIService
from backend.services.prompt_builder import PromptBuilder

def chat():
    ai = AIService()
    print("Chatbot running...")

    while True:
        user_input = input("You: ")

        if user_input == "exit":
            break

        messages = PromptBuilder.build_prompt(user_input)
        response = ai.ask(messages)
        print("Bot:", response)
