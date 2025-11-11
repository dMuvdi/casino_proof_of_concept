from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.api_client import fetch_existing_offers
from services.casino_discovery import discover_casinos_for_state
from services.promo_research import research_promotions
from services.comparison import compare_offers
from services.db_client import get_last_run, save_run_result
import os
import datetime

# ----------------------------------------------------------
# ⚙️ FastAPI App Setup
# ----------------------------------------------------------
app = FastAPI(
    title="Casino & Offer AI Researcher",
    description="AI-powered system using Perplexity and Supabase to find and compare casino promotions.",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------
# 🔐 Security Config
# ----------------------------------------------------------
CRON_SECRET_KEY = os.getenv("CRON_SECRET_KEY")


# ----------------------------------------------------------
# 🧩 Core Research Function
# ----------------------------------------------------------
def run_research_job(mode="manual"):
    """Runs the AI-powered casino research process."""
    print(f"[🕒] Starting {mode} run at {datetime.datetime.utcnow().isoformat()}")

    existing = fetch_existing_offers()
    states = ["New Jersey", "Michigan", "Pennsylvania", "West Virginia"]
    discovered, promos = {}, []

    # Discover casinos per state
    for state in states:
        print(f"→ Discovering casinos in {state}...")
        try:
            state_data = discover_casinos_for_state(state)
            discovered[state] = state_data["casinos"]
        except Exception as e:
            print(f"[⚠️] Error discovering casinos in {state}: {e}")
            discovered[state] = []

        # Research promotions for each casino
        for casino in discovered[state]:
            try:
                promo = research_promotions(casino, state)
                promos.append(promo)
            except Exception as e:
                print(f"[⚠️] Promo research failed for {casino}: {e}")

    # Compare results
    offer_comparisons = compare_offers(existing, promos)
    result = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "missing_casinos": discovered,
        "offer_comparisons": offer_comparisons,
    }

    save_run_result(mode, result)
    print(f"[✅] {mode.capitalize()} run completed and saved to Supabase.")
    return result


# ----------------------------------------------------------
# 🚀 API Endpoints
# ----------------------------------------------------------
@app.get("/")
def read_root():
    return {"Python": "on FastAPI"}

@app.get("/api/results")
async def get_results(mode: str = "manual"):
    """
    GET → Manual testing or dashboard-triggered runs.
    /api/results?mode=manual  → Runs the AI job manually
    /api/results?mode=last    → Fetches last saved run from Supabase
    """
    if mode == "manual":
        result = run_research_job("manual")
        return {"mode": "manual", "result": result}

    elif mode == "last":
        data = get_last_run()
        return {"mode": "last", "result": data}

    return {"error": "Invalid mode. Use 'manual' or 'last'."}


@app.get("/api/results/scheduled")
async def scheduled_results(request: Request):
    """
    POST → Secure endpoint for Supabase Edge Function (Cron)
    Requires header: x-cron-key: <CRON_SECRET_KEY>
    """
    incoming_key = request.headers.get("x-cron-key")
    if not incoming_key or incoming_key != CRON_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized cron access")

    result = run_research_job("scheduled")
    return {"mode": "scheduled", "result": result}


# ----------------------------------------------------------
# 🧾 Health Check (Optional)
# ----------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}

# This is important for Vercel
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
