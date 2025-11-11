import os
from supabase import create_client
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def save_run_result(mode: str, result: dict):
    """Insert a new research run result into Supabase."""
    try:
        response = supabase.table("research_runs").insert({
            "mode": mode,
            "result_json": result
        }).execute()
        print(f"[✅] Saved run to Supabase: {response}")
    except Exception as e:
        print("[❌] Failed to save run:", e)

def get_last_run():
    """Retrieve the latest research run from Supabase."""
    try:
        res = supabase.table("research_runs").select("*").order("created_at", desc=True).limit(1).execute()
        if res.data:
            return res.data[0]
    except Exception as e:
        print("[⚠️] Error fetching last run:", e)
    return None
