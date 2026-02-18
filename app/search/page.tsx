import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WatchCard } from "@/components/WatchCard";
import { searchPages } from "@/lib/alstra";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.toLowerCase() || "";

    const results = await searchPages(query);

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
