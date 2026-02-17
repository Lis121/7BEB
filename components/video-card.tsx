import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
    title: string;
    thumbnail: string;
    duration: string;
    category: string;
    timestamp: string;
    slug: string;
    className?: string;
}

export function VideoCard({
    title,
    thumbnail,
    duration,
    category,
    timestamp,
    slug,
    className,
}: VideoCardProps) {
    return (
        <Link href={`/videos/${slug}`} className={cn("group block space-y-3", className)}>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full text-foreground shadow-lg">
                        <Play className="h-6 w-6 fill-current" />
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                    {duration}
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-medium text-muted-foreground">
                    <span className="text-primary">{category}</span>
                    <span>•</span>
                    <span>{timestamp}</span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h3>
            </div>
        </Link>
    );
}
