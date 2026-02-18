import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchCategoryPages } from "@/lib/alstra";
import { VideoFeed } from "@/components/video-feed";


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

    // Fetch first batch of pages for this category
    const videos = await fetchCategoryPages(category, 8, 0);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12">
                <header className="mb-12 border-b border-border/40 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{title} News</h1>
                    <p className="text-muted-foreground">Latest updates and video coverage for {title}.</p>
                </header>

                <VideoFeed initialVideos={videos} category={category} />
            </main>

            <Footer />
        </div>
    );
}
