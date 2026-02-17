
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Latest Videos Section */}
        <section className="mb-12">
          <div className="flex items-center mb-8 border-l-4 border-primary pl-4">
            <h2 className="text-3xl font-bold tracking-tight uppercase">Latest</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LATEST_VIDEOS.map((video) => (
              <VideoCard key={video.path} {...video} />
            ))}
            {/* Duplicate for demo purposes to fill grid */}
            {LATEST_VIDEOS.map((video) => (
              <VideoCard key={`${video.path}-2`} {...video} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
