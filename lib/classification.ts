import { AlstraPage } from "./alstra";

export const CATEGORIES = [
    "Politics",
    "Business",
    "Tech",
    "Science",
    "Health",
    "Sports",
    "Entertainment",
    "World",
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
    Politics: ["senate", "congress", "election", "president", "vote", "policy", "law", "government", "diplomacy", "treaty", "campaign", "democrat", "republican"],
    Business: ["market", "stock", "economy", "startup", "invest", "finance", "trade", "ceo", "company", "merger", "acquisition", "profit", "bank"],
    Tech: ["software", "hardware", "ai", "artificial intelligence", "robot", "cyber", "internet", "app", "mobile", "code", "dev", "startup", "silicon valley"],
    Science: ["space", "nasa", "physics", "biology", "chemistry", "research", "study", "climate", "environment", "energy", "quantum", "lab"],
    Health: ["medical", "doctor", "virus", "vaccine", "health", "hospital", "care", "wellness", "disease", "cure", "medicine", "nutrition"],
    Sports: ["football", "basketball", "soccer", "baseball", "tennis", "olympic", "game", "match", "score", "team", "athlete", "championship"],
    Entertainment: ["movie", "film", "music", "celebrity", "star", "concert", "show", "series", "hollywood", "actor", "director", "cinema", "dragon"], // Dragon here for the zodiac examples
    World: ["international", "global", "war", "peace", "country", "nation", "border", "un", "united nations", "eu", "nato", "conflict"],
};

export function categorizePage(page: AlstraPage): Category {
    const text = `${page.title} ${page.slug}`.toLowerCase();

    for (const category of CATEGORIES) {
        const keywords = CATEGORY_KEYWORDS[category];
        if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
            return category;
        }
    }

    // Fallback - maybe based on first part of slug if it matches a category name
    const slugParts = page.slug.split("/");
    if (slugParts.length > 0) {
        const firstPart = slugParts[0].toLowerCase();
        const matchedCat = CATEGORIES.find(c => c.toLowerCase() === firstPart);
        if (matchedCat) return matchedCat;
    }

    return "World"; // Default fallback
}
