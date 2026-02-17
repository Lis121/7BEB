import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WatchCard } from "@/components/WatchCard";
import { fetchWatchPagesWithThumbnails } from "@/lib/alstra";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const watchPages = await fetchWatchPagesWithThumbnails(20);

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
            {watchPages.map((page) => (
              <WatchCard
                key={page.url}
                title={page.title}
                thumbnail={page.thumbnail}
                category={page.category}
                date={page.date}
                slug={page.slug}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
