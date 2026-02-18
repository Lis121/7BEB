import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WatchCard } from "@/components/WatchCard";
import { VideoFeed } from "@/components/video-feed";
import { fetchTrendingPages, fetchLatestPages } from "@/lib/alstra";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const trendingPages = await fetchTrendingPages(4);
  const latestPages = await fetchLatestPages(8);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 space-y-16">
        {/* Trending Section */}
        <section>
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Trending Now</h2>
              <p className="text-muted-foreground">Most viewed stories from around the world.</p>
            </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPages.map((video, idx) => (
              <WatchCard key={`trending-${idx}`} {...video} />
            ))}
          </div>
        </section>

        {/* Latest Section */}
        <section>
          <header className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Latest News</h2>
            <p className="text-muted-foreground">Breaking updates and fresh perspectives.</p>
          </header>
          <VideoFeed initialVideos={latestPages} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
