class PromptBuilder:
    @staticmethod
    def build_prompt(user_input, history=None, sensor_data=None):
        system_prompt = (
            "You are a Fitness Coach specialising in plyometric training. "
            "Provide structured, safe, personalised workouts."
        )

        messages = [{"role": "system", "content": system_prompt}]

        if history:
            for msg in history:
                role = "assistant" if msg.role == "bot" else "user"
                messages.append({"role": role, "content": msg.text})

        user_message = f"User input: {user_input}"
        if sensor_data:
            user_message += f"\nSensor data: {sensor_data}"

        messages.append({"role": "user", "content": user_message})

        return messages
