import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("PERPLEXITY_API_KEY")
API_URL = "https://api.perplexity.ai/chat/completions"


def research_promotions(casino_name: str, state: str):
    """Uses Perplexity AI to research current CASINO (not sports) promotions."""
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

    prompt = f"""
    Find the BEST current CASINO welcome bonus for {casino_name} in {state} (NOT sportsbook).
    Focus on: deposit match %, free spins/play value, total bonus amount.
    Return ONLY this JSON:
    {{
      "casino": "{casino_name}",
      "state": "{state}",
      "promotion": "brief title",
      "bonus_amount": 1000,
      "match_percent": 100,
      "description": "one line summary"
    }}
    Use 0 for bonus_amount or match_percent if not applicable.
    IMPORTANT: Return ONLY the JSON object, no additional text or markdown formatting.
    """

    payload = {
        "model": "sonar",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
    }

    res = requests.post(API_URL, headers=headers, json=payload)
    res.raise_for_status()
    data = res.json()
    content = data["choices"][0]["message"]["content"]

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "casino": casino_name,
            "state": state,
            "promotion": content,
            "bonus_amount": 0,
            "match_percent": 0,
            "description": "",
        }
