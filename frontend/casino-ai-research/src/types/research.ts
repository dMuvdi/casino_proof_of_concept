export interface OfferComparison {
    casino: string;
    state: string;
    current_offer: string;
    new_offer: string;
    current_bonus: number;
    new_bonus: number;
    status: "Better" | "Worse" | "Same" | "Alternative" | "New Casino";
    new_details: {
        casino: string;
        state: string;
        promotion: string;
        bonus_amount: number;
        match_percent: number;
        description: string;
    };
}

export interface ResearchResultSupabase {
    timestamp: string;
    missing_casinos: {
        [state: string]: string[];
    };
    offer_comparisons: OfferComparison[];
}

export interface ResearchResult {
    result_json: {
        timestamp: string;
        missing_casinos: {
            [state: string]: string[];
        };
        offer_comparisons: OfferComparison[];
    };
}

export interface ApiResponse {
    mode: string;
    result: ResearchResult;
}

export interface SupabaseResearchRun {
    id: number;
    mode: string;
    result_json: ResearchResultSupabase;
    created_at: string;
}

export interface CurrentCasino {
    casinodb_id: number;
    Offer_Name: string;
    offer_type: string;
    Expected_Deposit: number;
    Expected_Bonus: number;
    Name: string;
    states_id: number;
    state: {
        Name: string;
        Abbreviation: string;
    };
}

