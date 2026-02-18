import { AlstraPage, WatchPageWithThumbnail } from "./types";
import { categorizePage } from "./classification";

const SAAS_API_URL = "https://www.alstras.com";
const PROJECT_ID = "b17364ef-337e-4134-9b5e-2ab36c97e022";

// --- YouTube helpers ---

export function getYoutubeVideoId(html: string): string | null {
    const patterns = [
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export function getBestYoutubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// --- Helpers ---

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const PLACEHOLDER = "https://placehold.co/600x400/222/333?text=Video";

// In-memory cache for Edge runtime to avoid hitting API limits
let globalPagesCache: { data: AlstraPage[]; timestamp: number } | null = null;
const CACHE_TTL = 3600 * 1000; // 1 hour

/**
 * Fetch ALL pages from the API (paginated).
 * Useful for building search indexes or categorization.
 */
export async function fetchAllPages(): Promise<AlstraPage[]> {
    // Check in-memory cache first
    if (globalPagesCache && Date.now() - globalPagesCache.timestamp < CACHE_TTL) {
        return globalPagesCache.data;
    }

    let allPages: AlstraPage[] = [];
    let page = 1;

    try {
        while (true) {
            const res = await fetch(
                `${SAAS_API_URL}/api/public/pages?projectId=${PROJECT_ID}&type=pseo&limit=1000&page=${page}`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) break;

            const data = await res.json();
            const pages: AlstraPage[] = data.pages || [];

            if (pages.length === 0) break;

            allPages = [...allPages, ...pages];

            if (pages.length < 1000) break;
            page++;
        }

        // Update cache if we got results
        if (allPages.length > 0) {
            globalPagesCache = {
                data: allPages,
                timestamp: Date.now()
            };
        }
    } catch (error) {
        console.error("Failed to fetch all pages:", error);
        // Fallback to cache if available even if expired, to avoid breaking
        if (globalPagesCache) return globalPagesCache.data;
    }

    return allPages;
}

// --- Data Patterns for Sections ---

/**
 * Hydrate a list of AlstraPages with thumbnails by fetching their content.
 */
async function hydratePagesWithThumbnails(pages: AlstraPage[]): Promise<WatchPageWithThumbnail[]> {
    const results = await Promise.all(
        pages.map(async (page): Promise<WatchPageWithThumbnail> => {
            try {
                const contentRes = await fetch(
                    `${SAAS_API_URL}/api/public/content?projectId=${PROJECT_ID}&slug=${page.slug}`,
                    { next: { revalidate: 3600 } }
                );

                if (!contentRes.ok) {
                    return buildResult(page, PLACEHOLDER);
                }

                const pageData = await contentRes.json();
                const html: string = pageData.contentHtml || "";
                const videoId = getYoutubeVideoId(html);
                const thumbnail = videoId
                    ? getBestYoutubeThumbnail(videoId)
                    : PLACEHOLDER;

                // Pass updatedAt as date
                return buildResult(page, thumbnail, pageData.title, pageData.updatedAt);
            } catch (err) {
                console.error(`Content fetch failed for ${page.slug}:`, err);
                return buildResult(page, PLACEHOLDER);
            }
        })
    );
    return results;
}

/**
 * Fetch "Trending" pages.
 * Since we don't have real view counts, we'll shuffle the list to show a variety.
 */
export async function fetchTrendingPages(count: number): Promise<WatchPageWithThumbnail[]> {
    const allPages = await fetchAllPages();
    if (allPages.length === 0) return [];

    // Shuffle for "Trending" simulation
    const selected = shuffleArray(allPages).slice(0, count);
    return hydratePagesWithThumbnails(selected);
}

/**
 * Fetch "Latest" pages.
 * Assuming the API returns pages in creation order (oldest first),
 * we reverse the list to show the newest ones.
 */
export async function fetchLatestPages(count: number): Promise<WatchPageWithThumbnail[]> {
    const allPages = await fetchAllPages();
    if (allPages.length === 0) return [];

    // Reverse to get newest first
    // Note: If API order is not chronological, this might need adjustment.
    // However, usually DBs return in insertion order.
    const reversed = [...allPages].reverse();
    const selected = reversed.slice(0, count);
    return hydratePagesWithThumbnails(selected);
}

/**
 * Fetch pages for a specific category with offset and limit.
 */
export async function fetchCategoryPages(category: string, limit: number, offset: number = 0): Promise<WatchPageWithThumbnail[]> {
    const allPages = await fetchAllPages();

    // Filter by category
    const filtered = allPages.filter(page =>
        categorizePage(page).toLowerCase() === category.toLowerCase()
    );

    // Sort by latest (reverse chronological assumed from API)
    const reversed = [...filtered].reverse();

    // Slice for pagination
    const selected = reversed.slice(offset, offset + limit);
    return hydratePagesWithThumbnails(selected);
}

/**
 * @deprecated Use fetchTrendingPages or fetchLatestPages instead.
 */
export async function fetchWatchPagesWithThumbnails(
    count: number
): Promise<WatchPageWithThumbnail[]> {
    return fetchTrendingPages(count);
}

function buildResult(
    page: AlstraPage,
    thumbnail: string,
    apiTitle?: string,
    apiDate?: string // New optional parameter
): WatchPageWithThumbnail {
    const slugParts = page.slug.split("/").filter(Boolean);
    // category is the first segment, e.g. robert-duvall/some-page → Robert Duvall
    const rawCategory = slugParts.length > 0 ? slugParts[0] : "General";

    // Categorization logic from classification.ts isn't imported here to avoid circular dep,
    // but the categorizePage function is better. 
    // For now, let's just capitalize properly/use classification logic if we want.
    // Actually we can use categorizePage here now!
    const category = categorizePage(page);

    // title from the last slug segment as fallback
    const lastSegment = slugParts[slugParts.length - 1] || "";
    const fallbackTitle = lastSegment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
        slug: page.slug,
        url: `https://7beb.com/watch/${page.slug}`,
        title: apiTitle || page.title || fallbackTitle,
        thumbnail,
        category,
        date: apiDate || "", // Use provided date or empty string
    };
}
// Wait, buildResult doesn't have access to pageData.updatedAt unless passed.
// hydratePagesWithThumbnails passes pageData.title.
// I need to update buildResult signature to accept date/timestamp.

// Or I can just pass it as 'date'.
// In hydratePagesWithThumbnails:
// const pageData = await contentRes.json();
// ...
// return buildResult(page, thumbnail, pageData.title, pageData.updatedAt);
