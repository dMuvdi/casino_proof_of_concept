import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("PERPLEXITY_API_KEY")
API_URL = "https://api.perplexity.ai/chat/completions"


def discover_casinos_for_state(state: str):
    """Uses Perplexity AI to find all licensed/operational online in a given state."""
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

    prompt = f"""
    Find ALL licensed online casino operators currently operating in {state}, USA.

    Priority sources:
    - {state} Division of Gaming Enforcement
    - {state} Gaming Control Board  
    - Official state gaming commission websites

    Focus ONLY on online casino platforms (iGaming), NOT sportsbooks.

    Even if you find limited information, list all known operators.

    Return as JSON:
    {{
    "state": "{state}",
    "casinos": ["BetMGM", "DraftKings Casino", "FanDuel Casino", ...]
    }}

    Return ONLY the JSON object, no markdown or additional text.
    """

    payload = {
        "model": "sonar",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }

    res = requests.post(API_URL, headers=headers, json=payload)
    data = res.json()
    content = data["choices"][0]["message"]["content"]

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {"state": state, "casinos": []}
