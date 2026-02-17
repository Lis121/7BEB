export const runtime = 'edge';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { VideoCard } from "@/components/video-card";

// Mock Data
const LATEST_VIDEOS = [
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
    path: "/videos/space-exploration",
    title: "Mars Mission: New Timeline Revealed by NASA",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    duration: "8:15",
    category: "Science",
    timestamp: "4 hours ago",
    slug: "mars-mission"
  },
  {
    path: "/videos/market-update",
    title: "Global Markets Rally as Inflation Fears Subside",
    thumbnail: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop",
    duration: "3:45",
    category: "Business",
    timestamp: "5 hours ago",
    slug: "market-update"
  },
  {
    path: "/videos/urban-farming",
    title: "Vertical Gardens: The Future of Urban Agriculture",
    thumbnail: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1000&auto=format&fit=crop",
    duration: "6:30",
    category: "Environment",
    timestamp: "12 hours ago",
    slug: "urban-farming"
  }
];

const POLITICS_VIDEOS = [
  {
    path: "/videos/senate-hearing",
    title: "Key Takeaways from Today's Senate Hearing",
    thumbnail: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=1000&auto=format&fit=crop", // Changed to valid URL pattern
    duration: "12:00",
    category: "Politics",
    timestamp: "1 day ago",
    slug: "senate-hearing"
  },
  {
    path: "/videos/policy-change",
    title: "New Policy Impacts Small Business Owners",
    thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
    duration: "5:10",
    category: "Politics",
    timestamp: "1 day ago",
    slug: "policy-change"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Hero />

        {/* Latest News Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Latest News</h2>
            <a href="/latest" className="text-primary hover:text-primary/80 font-medium text-sm">View All &rarr;</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LATEST_VIDEOS.map((video) => (
              <VideoCard key={video.path} {...video} />
            ))}
          </div>
        </section>

        {/* Politics Section */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Politics</h2>
              <a href="/politics" className="text-primary hover:text-primary/80 font-medium text-sm">View All &rarr;</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 relative rounded-xl overflow-hidden aspect-video bg-muted group cursor-pointer">
                {/* Featured Big Card Mock */}
                <img src="https://images.unsplash.com/photo-1529101091760-61df6be2df6b?q=80&w=1600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Politics Feature" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <span className="text-primary font-bold text-sm mb-2 block">Exclusive</span>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 max-w-2xl">Inside the Summit: Global Leaders Reach Climate Accord</h3>
                  <p className="text-gray-300 line-clamp-2 max-w-xl">A behind-the-scenes look at the negotiations that led to today's historic announcement.</p>
                </div>
              </div>
              <div className="space-y-6">
                {POLITICS_VIDEOS.map((video) => (
                  <VideoCard key={video.path} {...video} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
