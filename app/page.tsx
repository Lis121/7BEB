import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const SAAS_API_URL = "https://www.alstras.com";
const PROJECT_ID = "b17364ef-337e-4134-9b5e-2ab36c97e022";

type SitemapEntry = {
  url: string;
  lastModified?: string;
};

function slugToTitle(url: string): string {
  // Extract the last segment of the URL path as the display title
  const path = new URL(url).pathname;
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function fetchWatchPages(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(
      `${SAAS_API_URL}/api/public/sitemap?projectId=${PROJECT_ID}&format=json&limit=5000&page=1`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data: SitemapEntry[] = await res.json();
    // Filter only /watch/ pages
    return data.filter(entry => {
      const path = new URL(entry.url).pathname;
      return path.startsWith('/watch/');
    });
  } catch (error) {
    console.error('Failed to fetch watch pages:', error);
    return [];
  }
}

export default async function Home() {
  const allWatchPages = await fetchWatchPages();
  const randomPages = shuffleArray(allWatchPages).slice(0, 20);

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
            {randomPages.map((page) => {
              const path = new URL(page.url).pathname;
              const title = slugToTitle(page.url);
              const category = new URL(page.url).pathname.split('/').filter(Boolean)[1] || 'General';
              const categoryDisplay = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              const date = page.lastModified
                ? new Date(page.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '';

              return (
                <Link
                  key={page.url}
                  href={path}
                  className="group block bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="p-5 space-y-4">
                    <h3 className="font-bold text-lg leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                      {title}
                    </h3>

                    <div className="h-px bg-border/50 w-full" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Category</p>
                        <p className="text-sm font-medium text-foreground">{categoryDisplay}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Published</p>
                        <p className="text-sm font-medium text-foreground">{date}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
