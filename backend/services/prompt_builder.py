class PromptBuilder:
    @staticmethod
    def build_prompt(user_input, history=None, sensor_data=None, profile=None):
        system_prompt = (
            "You are a Fitness Coach specialising in plyometric training. "
            "Provide structured, safe, personalised workouts."
        )

        if profile:
            details = []
            if profile.get("age"):
                details.append(f"Age: {profile['age']}")
            if profile.get("weight"):
                details.append(f"Weight: {profile['weight']}kg")
            if profile.get("fitness_level"):
                details.append(f"Fitness level: {profile['fitness_level']}")
            if profile.get("injuries"):
                details.append(f"Injuries/limitations: {profile['injuries']}")
            if details:
                system_prompt += " The user has the following profile: " + ", ".join(details) + ". Tailor your response accordingly."

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
