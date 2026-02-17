import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { VideoCard } from "@/components/video-card";
import { notFound } from "next/navigation";

// Mock Data (In a real app, this would come from a database)
const CATEGORY_VIDEOS = [
    {
        path: "/videos/tech-startup-boom",
        title: "The Next Big Thing: Silicon Valley's Newest Unicorns",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
        duration: "4:20",
        category: "Tech",
        timestamp: "2 hours ago",
        slug: "tech-startup-boom"
    },
    {
        path: "/videos/senate-hearing",
        title: "Key Takeaways from Today's Senate Hearing",
        thumbnail: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=1000&auto=format&fit=crop",
        duration: "12:00",
        category: "Politics",
        timestamp: "1 day ago",
        slug: "senate-hearing"
    },
    // Add more mock data as needed to populate the grid
    {
        path: "/videos/ai-revolution",
        title: "How AI is Reshaping Modern Medicine",
        thumbnail: "https://images.unsplash.com/photo-1531746790731-bcad0f448c63?q=80&w=1000&auto=format&fit=crop",
        duration: "15:30",
        category: "Tech",
        timestamp: "5 hours ago",
        slug: "ai-revolution"
    },
    {
        path: "/videos/climate-summit",
        title: "Global Leaders Reach Historic Climate Deal",
        thumbnail: "https://images.unsplash.com/photo-1569163139500-66446e292676?q=80&w=1000&auto=format&fit=crop",
        duration: "9:45",
        category: "Politics",
        timestamp: "3 hours ago",
        slug: "climate-summit"
    }
];

export function generateStaticParams() {
    return [
        { category: "politics" },
        { category: "tech" },
        { category: "business" },
        { category: "entertainment" },
    ];
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    // Simple filter for mock purposes
    // In production, you'd fetch based on category
    const videos = CATEGORY_VIDEOS.filter(v =>
        v.category.toLowerCase() === category.toLowerCase() ||
        // Allow some cross-pollination for demo if exact match fails
        true
    );

    const title = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12">
                <header className="mb-12 border-b border-border/40 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{title} News</h1>
                    <p className="text-muted-foreground">Latest updates and video coverage for {title}.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video, idx) => (
                        <VideoCard key={idx} {...video} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
