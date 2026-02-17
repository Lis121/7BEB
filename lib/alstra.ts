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

// --- Types ---

type AlstraPage = {
    slug: string;
    title: string;
    type: string;
};

export type WatchPageWithThumbnail = {
    slug: string;
    url: string;
    title: string;
    thumbnail: string;
    category: string;
    date: string;
};

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
 * Fetch `count` random /watch pages with their YouTube thumbnails.
 *
 * Uses the pages API (1 call) to get the list, then fetches content
 * for each selected page to extract the YouTube video ID.
 */
export async function fetchWatchPagesWithThumbnails(
    count: number
): Promise<WatchPageWithThumbnail[]> {
    try {
        // Step 1 – get all pages from the pages API (single request)
        const listRes = await fetch(
            `${SAAS_API_URL}/api/public/pages?projectId=${PROJECT_ID}&type=pseo&limit=300`,
            { next: { revalidate: 60 } }
        );
        if (!listRes.ok) {
            console.error("Alstra pages API error:", listRes.status);
            return [];
        }

        const listData = await listRes.json();
        const allPages: AlstraPage[] = listData.pages || [];

        if (allPages.length === 0) return [];

        // Step 2 – shuffle & pick
        const selected = shuffleArray(allPages).slice(0, count);

        // Step 3 – fetch content for each page (all in parallel)
        const results = await Promise.all(
            selected.map(async (page): Promise<WatchPageWithThumbnail> => {
                try {
                    const contentRes = await fetch(
                        `${SAAS_API_URL}/api/public/content?projectId=${PROJECT_ID}&slug=${page.slug}`,
                        { next: { revalidate: 60 } }
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

                    return buildResult(page, thumbnail, pageData.title);
                } catch (err) {
                    console.error(`Content fetch failed for ${page.slug}:`, err);
                    return buildResult(page, PLACEHOLDER);
                }
            })
        );

        return results;
    } catch (error) {
        console.error("Failed to fetch watch pages with thumbnails:", error);
        return [];
    }
}

function buildResult(
    page: AlstraPage,
    thumbnail: string,
    apiTitle?: string
): WatchPageWithThumbnail {
    const slugParts = page.slug.split("/").filter(Boolean);
    // category is the first segment, e.g. robert-duvall/some-page → Robert Duvall
    const rawCategory = slugParts.length > 0 ? slugParts[0] : "General";
    const category = rawCategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

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
        date: "",
    };
}
