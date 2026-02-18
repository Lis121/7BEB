import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchResults } from "@/components/search-results";
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

    const { results, hasMore, totalMatches } = await searchPages(query, 8, 0);

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
                            ? `Showing results for "${q}" (${totalMatches} matches)`
                            : "Please enter a search term"}
                    </p>
                </header>

                <SearchResults
                    initialResults={results}
                    query={query}
                    hasMore={hasMore}
                    totalMatches={totalMatches}
                />
            </main>

            <Footer />
        </div>
    );
}
