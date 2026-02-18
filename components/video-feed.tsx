"use client";

import { useState, useTransition } from "react";
import { WatchPageWithThumbnail } from "@/lib/types";
import { WatchCard } from "./WatchCard";
import { Loader2 } from "lucide-react";
import { getMoreVideos, getMoreCategoryVideos } from "@/app/actions";

interface VideoFeedProps {
    initialVideos: WatchPageWithThumbnail[];
    category?: string; // Optional category filter
}

export function VideoFeed({ initialVideos, category }: VideoFeedProps) {
    const [videos, setVideos] = useState<WatchPageWithThumbnail[]>(initialVideos);
    const [isPending, startTransition] = useTransition();

    const loadMore = () => {
        startTransition(async () => {
            let newVideos: WatchPageWithThumbnail[] = [];

            if (category) {
                // Determine offset based on current video count
                const offset = videos.length;
                newVideos = await getMoreCategoryVideos(category, offset);
            } else {
                // Homepage behavior (random/trending)
                newVideos = await getMoreVideos(8);
            }

            // Append new videos
            // For homepage (random), we might get duplicates, but filtering them out helps
            // For category (pagination), duplicates shouldn't happen unless data changes
            setVideos((prev) => {
                const existingSlugs = new Set(prev.map(v => v.slug));
                const uniqueNewVideos = newVideos.filter(v => !existingSlugs.has(v.slug));
                return [...prev, ...uniqueNewVideos];
            });
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video, idx) => (
                    <WatchCard key={`${video.slug}-${idx}`} {...video} />
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={loadMore}
                    disabled={isPending}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:pointer-events-none disabled:opacity-50"
                >
                    <span className="relative flex items-center gap-2">
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isPending ? "Loading..." : "Load More Stories"}
                    </span>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:animate-shimmer" />
                </button>
            </div>
        </div>
    );
}
