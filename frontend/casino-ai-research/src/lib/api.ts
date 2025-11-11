import { supabase } from "./supabase";
import { ApiResponse, ResearchResult, SupabaseResearchRun, CurrentCasino } from "@/types/research";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://casino-proof-of-concept-api.vercel.app";
const XANO_API_URL = "https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB";

export async function fetchFromAPI(mode: "manual" | "last" = "last"): Promise<ResearchResult | null> {
    try {
        const response = await fetch(`${API_URL}/api/results?mode=${mode}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch from API");
        }

        const data: ApiResponse = await response.json();
        return data.result;
    } catch (error) {
        console.error("Error fetching from API:", error);
        return null;
    }
}

export async function fetchAllResearchRuns(): Promise<SupabaseResearchRun[]> {
    try {
        const { data, error } = await supabase
            .from("research_runs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching research runs:", error);
        return [];
    }
}

export async function triggerManualRun(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/results?mode=manual`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to trigger manual run");
        }

        return true;
    } catch (error) {
        console.error("Error triggering manual run:", error);
        return false;
    }
}

export async function fetchCurrentCasinos(): Promise<CurrentCasino[]> {
    try {
        const response = await fetch(XANO_API_URL, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch current casinos");
        }

        const data: CurrentCasino[] = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching current casinos:", error);
        return [];
    }
}

