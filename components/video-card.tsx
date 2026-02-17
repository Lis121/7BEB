import Image from "next/image";
import Link from "next/link";
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
        <Link href={`/videos/${slug}`} className={cn("group block bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors", className)}>
            <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            <div className="p-4 space-y-4">
                <h3 className="font-bold text-lg leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                    {title}
                </h3>

                <div className="h-px bg-border/50 w-full" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Category</p>
                        <p className="text-sm font-medium text-foreground">{category}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Published</p>
                        <p className="text-sm font-medium text-foreground">{timestamp}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
