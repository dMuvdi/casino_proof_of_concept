/**
 * Cleans and parses JSON that might be wrapped in markdown code blocks
 */
export function parseMarkdownJson(content: string): any {
    if (!content) return null;

    let cleaned = content.trim();

    // Remove markdown code blocks if present
    if (cleaned.startsWith("```")) {
        const lines = cleaned.split("\n");
        if (lines.length > 2) {
            // Remove first and last lines (the backticks)
            cleaned = lines.slice(1, -1).join("\n");
        }
        // Also handle inline markdown
        cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    try {
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
}

/**
 * Safely gets a string value, handling markdown JSON format
 */
export function safeGetString(value: any, fallback: string = ""): string {
    if (typeof value === "string") {
        // Check if it looks like JSON wrapped in markdown
        if (value.trim().startsWith("```") || value.trim().startsWith("{")) {
            const parsed = parseMarkdownJson(value);
            if (parsed && typeof parsed === "object") {
                // Return a readable format from the parsed object
                return parsed.promotion || parsed.description || fallback;
            }
        }
        return value;
    }
    return fallback;
}

/**
 * Safely gets a number value from potentially wrapped JSON
 */
export function safeGetNumber(value: any, fallback: number = 0): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) return parsed;
    }
    return fallback;
}

