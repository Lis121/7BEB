import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WatchCard } from "@/components/WatchCard";
import { fetchAllPages } from "@/lib/alstra";
import { getYoutubeVideoId, getBestYoutubeThumbnail } from "@/lib/alstra";
import { categorizePage } from "@/lib/classification";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.toLowerCase() || "";

    let results: any[] = [];

    if (query) {
        const allPages = await fetchAllPages();

        // Filter pages based on query
        const filtered = allPages.filter((page) => {
            const text = `${page.title} ${page.slug}`.toLowerCase();
            return text.includes(query);
        });

        // We need to fetch thumbnails for the results
        // Limit to top 20 to avoid excessive API calls on search
        const topResults = filtered.slice(0, 20);

        results = await Promise.all(topResults.map(async (page) => {
            // We need to fetch content to get thumbnail... or just use placeholder
            // Ideally we'd have thumbnail in the list API, but we don't.
            // Let's try to fetch content.
            try {
                const res = await fetch(`https://www.alstras.com/api/public/content?projectId=b17364ef-337e-4134-9b5e-2ab36c97e022&slug=${page.slug}`, {
                    next: { revalidate: 3600 }
                });
                if (res.ok) {
                    const data = await res.json();
                    const videoId = getYoutubeVideoId(data.contentHtml || "");
                    const thumbnail = videoId ? getBestYoutubeThumbnail(videoId) : "https://placehold.co/600x400/222/333?text=Video";

                    return {
                        ...page,
                        thumbnail,
                        category: categorizePage(page),
                        date: "", // Date not available in list
                        url: `/watch/${page.slug}`
                    };
                }
            } catch (e) {
                console.error(e);
            }

            return {
                ...page,
                thumbnail: "https://placehold.co/600x400/222/333?text=Video",
                category: categorizePage(page),
                date: "",
                url: `/watch/${page.slug}`
            };
        }));
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12">
                <header className="mb-12 border-b border-border/40 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        Search Results
                    </h1>
                    <p className="text-muted-foreground">
                        {query
                            ? `Showing results for "${q}"`
                            : "Please enter a search term"}
                    </p>
                </header>

                {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((video, idx) => (
                            <WatchCard key={idx} {...video} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">
                            No results found for "{q}"
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
