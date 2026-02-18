import { AlstraPage, WatchPageWithThumbnail } from "./types";
import { categorizePage } from "./classification";
import Fuse from "fuse.js";

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

/**
 * Fetch ALL pages from the API (paginated).
 */
export async function fetchAllPages(): Promise<AlstraPage[]> {
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
    } catch (error) {
        console.error("Failed to fetch all pages:", error);
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
 */
export async function fetchTrendingPages(count: number): Promise<WatchPageWithThumbnail[]> {
    const allPages = await fetchAllPages();
    if (allPages.length === 0) return [];

    const selected = shuffleArray(allPages).slice(0, count);
    return hydratePagesWithThumbnails(selected);
}

/**
 * Fetch "Latest" pages.
 */
export async function fetchLatestPages(count: number): Promise<WatchPageWithThumbnail[]> {
    const allPages = await fetchAllPages();
    if (allPages.length === 0) return [];

    const reversed = [...allPages].reverse();
    const selected = reversed.slice(0, count);
    return hydratePagesWithThumbnails(selected);
}

/**
 * Fetch pages for a specific category with offset and limit.
 */
export async function fetchCategoryPages(category: string, limit: number, offset: number = 0): Promise<WatchPageWithThumbnail[]> {
    const allPages = await fetchAllPages();

    const filtered = allPages.filter(page =>
        categorizePage(page).toLowerCase() === category.toLowerCase()
    );

    const reversed = [...filtered].reverse();
    const selected = reversed.slice(offset, offset + limit);
    return hydratePagesWithThumbnails(selected);
}

/**
 * Search pages using Fuse.js for fuzzy matching.
 * Returns a paginated batch with thumbnails.
 */
export async function searchPages(query: string, limit: number = 8, offset: number = 0): Promise<{ results: WatchPageWithThumbnail[]; hasMore: boolean; totalMatches: number }> {
    if (!query) return { results: [], hasMore: false, totalMatches: 0 };

    const allPages = await fetchAllPages();
    if (allPages.length === 0) return { results: [], hasMore: false, totalMatches: 0 };

    const fuse = new Fuse(allPages, {
        keys: [
            { name: 'title', weight: 0.7 },
            { name: 'slug', weight: 0.3 }
        ],
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 2,
    });

    const allResults = fuse.search(query);
    const totalMatches = allResults.length;
    const batch = allResults.slice(offset, offset + limit).map(r => r.item);
    const hasMore = offset + limit < totalMatches;

    // Hydrate only the small batch (8 items) to stay within Edge timeout
    const hydrated = await hydratePagesWithThumbnails(batch);

    return { results: hydrated, hasMore, totalMatches };
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
    apiDate?: string
): WatchPageWithThumbnail {
    const slugParts = page.slug.split("/").filter(Boolean);
    const category = categorizePage(page);

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
        date: apiDate || "",
    };
}
