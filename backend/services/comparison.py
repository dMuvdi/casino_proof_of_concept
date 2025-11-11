def compare_offers(existing_offers, discovered_promos):
    """Compare current offers vs AI-discovered ones."""
    results = []

    for promo in discovered_promos:
        casino = promo.get("casino")
        if not casino:
            continue

        current = existing_offers.get(casino, {})

        if not current:
            status = "New Casino"
        else:
            current_bonus = _extract_bonus_value(current)
            new_bonus = _extract_bonus_value(promo)

            if new_bonus > current_bonus:
                status = "Better"
            elif new_bonus < current_bonus:
                status = "Worse"
            elif new_bonus == current_bonus and current_bonus > 0:
                status = "Same"
            else:
                status = "Alternative"

        results.append(
            {
                "casino": casino,
                "state": promo.get("state", ""),
                "current_offer": current.get("Offer_Name")
                or current.get("promotion", ""),
                "new_offer": promo.get("promotion", ""),
                "current_bonus": _extract_bonus_value(current),
                "new_bonus": _extract_bonus_value(promo),
                "status": status,
                "new_details": promo,
            }
        )

    return results


def _extract_bonus_value(offer):
    """Extract numeric bonus value for comparison."""
    if not offer:
        return 0

    bonus = offer.get("bonus_amount") or offer.get("Bonus_Amount", 0)
    match = offer.get("match_percent") or offer.get("Match_Percent", 0)

    try:
        bonus = float(bonus) if bonus else 0
        match = float(match) if match else 0
    except (ValueError, TypeError):
        bonus = 0
        match = 0

    return bonus + (match * 10)
