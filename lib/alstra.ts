const SAAS_API_URL = "https://www.alstras.com";
const PROJECT_ID = "b17364ef-337e-4134-9b5e-2ab36c97e022";

// --- YouTube helpers ---

/**
 * Extract the first YouTube video ID (11 chars) from HTML content.
 * Handles embed, watch, youtu.be and youtube-nocookie URLs.
 */
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

/**
 * Build the best-quality YouTube thumbnail URL for a given video ID.
 */
export function getBestYoutubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// --- Alstra API types ---

type SitemapEntry = {
    url: string;
    lastModified?: string;
};

export type WatchPageWithThumbnail = {
    slug: string;
    url: string;
    title: string;
    thumbnail: string;
    category: string;
    date: string;
};

// --- Fetching logic ---

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function slugToTitle(url: string): string {
    const path = new URL(url).pathname;
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';
    return lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Fetch `count` random /watch pages with their YouTube thumbnails.
 *
 * 1. Fetches all watch-page URLs from the sitemap API.
 * 2. Shuffles and picks `count` pages.
 * 3. Fetches each page's contentHtml (batched 5 at a time).
 * 4. Extracts the YouTube video ID and builds a thumbnail URL.
 */
export async function fetchWatchPagesWithThumbnails(
    count: number
): Promise<WatchPageWithThumbnail[]> {
    const PLACEHOLDER = "https://placehold.co/600x400/222/333?text=Video";

    try {
        // Step 1 – get all watch-page URLs from sitemap
        const res = await fetch(
            `${SAAS_API_URL}/api/public/sitemap?projectId=${PROJECT_ID}&format=json&limit=5000&page=1`,
            { cache: "no-store" }
        );
        if (!res.ok) return [];

        const data: SitemapEntry[] = await res.json();
        const watchPages = data.filter((entry) => {
            const path = new URL(entry.url).pathname;
            return path.startsWith("/watch/");
        });

        if (watchPages.length === 0) return [];

        // Step 2 – shuffle & pick
        const selected = shuffleArray(watchPages).slice(0, count);

        // Step 3 – fetch content in batches of 5
        const BATCH_SIZE = 5;
        const results: WatchPageWithThumbnail[] = [];

        for (let i = 0; i < selected.length; i += BATCH_SIZE) {
            const batch = selected.slice(i, i + BATCH_SIZE);

            const batchResults = await Promise.all(
                batch.map(async (entry) => {
                    const path = new URL(entry.url).pathname;
                    // slug is everything after /watch/
                    const slug = path.replace(/^\/watch\//, "");

                    try {
                        const contentRes = await fetch(
                            `${SAAS_API_URL}/api/public/content?projectId=${PROJECT_ID}&slug=${slug}`,
                            { cache: "no-store" }
                        );

                        if (!contentRes.ok) {
                            return buildResult(entry, slug, PLACEHOLDER);
                        }

                        const pageData = await contentRes.json();
                        const html: string = pageData.contentHtml || "";

                        // Step 4 – extract video ID & build thumbnail
                        const videoId = getYoutubeVideoId(html);
                        const thumbnail = videoId
                            ? getBestYoutubeThumbnail(videoId)
                            : PLACEHOLDER;

                        return buildResult(entry, slug, thumbnail, pageData.title);
                    } catch {
                        return buildResult(entry, slug, PLACEHOLDER);
                    }
                })
            );

            results.push(...batchResults);
        }

        return results;
    } catch (error) {
        console.error("Failed to fetch watch pages with thumbnails:", error);
        return [];
    }
}

function buildResult(
    entry: SitemapEntry,
    slug: string,
    thumbnail: string,
    apiTitle?: string
): WatchPageWithThumbnail {
    const path = new URL(entry.url).pathname;
    const segments = path.split("/").filter(Boolean);
    // category is the segment after "watch", e.g. /watch/knives/... → knives
    const rawCategory = segments.length > 1 ? segments[1] : "General";
    const category = rawCategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const date = entry.lastModified
        ? new Date(entry.lastModified).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "";

    return {
        slug,
        url: entry.url,
        title: apiTitle || slugToTitle(entry.url),
        thumbnail,
        category,
        date,
    };
}
