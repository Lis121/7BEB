"use client";

import { useState, useTransition } from "react";
import { WatchCard } from "@/components/WatchCard";
import { getMoreSearchResults } from "@/app/actions";
import { WatchPageWithThumbnail } from "@/lib/types";

interface SearchResultsProps {
    initialResults: WatchPageWithThumbnail[];
    query: string;
    hasMore: boolean;
    totalMatches: number;
}

export function SearchResults({ initialResults, query, hasMore: initialHasMore, totalMatches }: SearchResultsProps) {
    const [results, setResults] = useState(initialResults);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isPending, startTransition] = useTransition();

    const loadMore = () => {
        startTransition(async () => {
            const data = await getMoreSearchResults(query, results.length);
            setResults(prev => [...prev, ...data.results]);
            setHasMore(data.hasMore);
        });
    };

    return (
        <>
            {results.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((video, idx) => (
                            <WatchCard key={`${video.slug}-${idx}`} {...video} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={loadMore}
                                disabled={isPending}
                                className="px-8 py-3 rounded-lg border border-border/60 bg-card hover:bg-accent text-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Loading..." : `Load More (${totalMatches - results.length} remaining)`}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        No results found for &quot;{query}&quot;
                    </p>
                </div>
            )}
        </>
    );
}
