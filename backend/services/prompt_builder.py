class PromptBuilder:
    @staticmethod
    def build_prompt(user_input, sensor_data=None):
        system_prompt = (
            "You are a Fitness Coach specialising in plyometric training. "
            "Provide structured, safe, personalised workouts."
        )

        user_message = f"User input: {user_input}"

        if sensor_data:
            user_message += f"\nSensor data: {sensor_data}"

        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
