"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface WatchCardProps {
    title: string;
    thumbnail: string;
    category: string;
    date: string;
    slug: string;
}

/**
 * YouTube thumbnail fallback chain:
 * maxresdefault.jpg → sddefault.jpg → hqdefault.jpg
 */
const FALLBACK_CHAIN: Record<string, string> = {
    "maxresdefault.jpg": "sddefault.jpg",
    "sddefault.jpg": "hqdefault.jpg",
};

function getNextFallback(currentSrc: string): string | null {
    for (const [current, next] of Object.entries(FALLBACK_CHAIN)) {
        if (currentSrc.includes(current)) {
            return currentSrc.replace(current, next);
        }
    }
    return null;
}

export function WatchCard({
    title,
    thumbnail,
    category,
    date,
    slug,
}: WatchCardProps) {
    const [imgSrc, setImgSrc] = useState(thumbnail);

    const handleError = useCallback(() => {
        const next = getNextFallback(imgSrc);
        if (next) setImgSrc(next);
    }, [imgSrc]);

    const handleLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const img = e.currentTarget;
            // YouTube returns a tiny 120×90 placeholder with HTTP 200 when a
            // high-res thumbnail doesn't exist. Treat it like a 404.
            if (img.naturalWidth === 120) {
                const next = getNextFallback(imgSrc);
                if (next) setImgSrc(next);
            }
        },
        [imgSrc]
    );

    return (
        <Link
            href={`/watch/${slug}`}
            className="group block bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
        >
            <div className="relative aspect-video overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imgSrc}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    onError={handleError}
                    onLoad={handleLoad}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            <div className="p-5 space-y-4">
                <h3 className="font-bold text-lg leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                    {title}
                </h3>

                <div className="h-px bg-border/50 w-full" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                            Category
                        </p>
                        <p className="text-sm font-medium text-foreground">{category}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                            Published
                        </p>
                        <p className="text-sm font-medium text-foreground">{date}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
