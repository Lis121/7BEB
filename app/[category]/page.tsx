import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WatchCard } from "@/components/WatchCard";
import { notFound } from "next/navigation";
import { fetchAllPages, getYoutubeVideoId, getBestYoutubeThumbnail } from "@/lib/alstra";
import { categorizePage } from "@/lib/classification";



// Mock Data (In a real app, this would come from a database)


export function generateStaticParams() {
    return [
        { category: "politics" },
        { category: "tech" },
        { category: "business" },
        { category: "science" },
        { category: "health" },
        { category: "sports" },
        { category: "entertainment" },
        { category: "world" },
    ];
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const title = category.charAt(0).toUpperCase() + category.slice(1);

    // Fetch all pages and filter by category
    const allPages = await fetchAllPages();
    const filteredPages = allPages.filter(page =>
        categorizePage(page).toLowerCase() === category.toLowerCase()
    );

    // Limit to 20 for now and fetch details/thumbnails
    const topPages = filteredPages.slice(0, 20);

    const videos = await Promise.all(topPages.map(async (page) => {
        try {
            const res = await fetch(`https://www.alstras.com/api/public/content?projectId=b17364ef-337e-4134-9b5e-2ab36c97e022&slug=${page.slug}`, {
                next: { revalidate: 3600 }
            });
            if (res.ok) {
                const data = await res.json();
                const videoId = getYoutubeVideoId(data.contentHtml || "");
                const thumbnail = videoId ? getBestYoutubeThumbnail(videoId) : "https://placehold.co/600x400/222/333?text=Video";

                return {
                    slug: page.slug,
                    title: page.title,
                    thumbnail,
                    category: title,
                    date: "",
                    url: `/watch/${page.slug}`
                };
            }
        } catch (e) {
            console.error(e);
        }

        return {
            slug: page.slug,
            title: page.title,
            thumbnail: "https://placehold.co/600x400/222/333?text=Video",
            category: title,
            date: "",
            url: `/watch/${page.slug}`
        };
    }));

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12">
                <header className="mb-12 border-b border-border/40 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{title} News</h1>
                    <p className="text-muted-foreground">Latest updates and video coverage for {title}.</p>
                </header>

                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map((video, idx) => (
                            <WatchCard key={idx} {...video} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No videos found in this category.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
