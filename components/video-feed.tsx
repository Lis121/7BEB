"use client";

import { useState, useTransition } from "react";
import { WatchPageWithThumbnail } from "@/lib/alstra";
import { WatchCard } from "@/components/WatchCard";
import { getMoreVideos } from "@/app/actions";
import { Loader2 } from "lucide-react";

interface VideoFeedProps {
    initialVideos: WatchPageWithThumbnail[];
}

export function VideoFeed({ initialVideos }: VideoFeedProps) {
    const [videos, setVideos] = useState<WatchPageWithThumbnail[]>(initialVideos);
    const [isPending, startTransition] = useTransition();

    const loadMore = () => {
        startTransition(async () => {
            const newVideos = await getMoreVideos(20);
            setVideos((prev) => [...prev, ...newVideos]);
        });
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((page, index) => (
                    <WatchCard
                        key={`${page.slug}-${index}`}
                        title={page.title}
                        thumbnail={page.thumbnail}
                        category={page.category}
                        date={page.date}
                        slug={page.slug}
                    />
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <button
                    onClick={loadMore}
                    disabled={isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <span>Load More</span>
                        </>
                    )}
                </button>
            </div>
        </>
    );
}
