import requests

API_URL = "https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB"


def fetch_existing_offers():
    """Fetch and normalize the current promotional offers from the Xano endpoint."""
    try:
        res = requests.get(API_URL, timeout=10)
        res.raise_for_status()
        data = res.json()

        offers = {}
        if not isinstance(data, list):
            print("[⚠️] Unexpected payload format while fetching offers.")
            return offers

        for item in data:
            if not isinstance(item, dict):
                continue

            casino_name = item.get("Name") or item.get("casino") or item.get("name")
            if not casino_name:
                continue

            raw_state = item.get("state") or {}
            if isinstance(raw_state, dict):
                state_payload = {
                    "Name": raw_state.get("Name"),
                    "Abbreviation": raw_state.get("Abbreviation"),
                }
            else:
                state_payload = {
                    "Name": raw_state,
                    "Abbreviation": None,
                }

            offers[casino_name] = {
                "Name": casino_name,
                "casinodb_id": item.get("casinodb_id"),
                "Offer_Name": item.get("Offer_Name", ""),
                "offer_type": item.get("offer_type"),
                "Expected_Deposit": item.get("Expected_Deposit"),
                "Expected_Bonus": item.get("Expected_Bonus"),
                "states_id": item.get("states_id"),
                "state": state_payload,
            }

        return offers
    except Exception as e:
        print("[❌] Error fetching offers:", e)
        return {}
