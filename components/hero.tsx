import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative w-full min-h-[75vh] md:min-h-[85vh] overflow-hidden flex items-end">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=3200&auto=format&fit=crop"
                    alt="Featured News Background"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            </div>

            <div className="relative container mx-auto px-4 pt-20 pb-12 md:pb-24">
                <div className="max-w-2xl space-y-4">
                    <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span>Breaking News</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-foreground">
                        Senate Passes Historic Infrastructure Bill After Marathon Session
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground line-clamp-2">
                        In a decisive late-night vote, the Senate approved the sweeping 1.2 trillion dollar package, marking a major victory for the administration's domestic agenda.
                    </p>

                    <div className="pt-4 flex items-center space-x-4">
                        <Link href="/videos/senate-passes-bill" className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
                            <Play className="h-5 w-5 fill-current" />
                            <span>Watch Report</span>
                        </Link>
                        <button className="px-6 py-3 rounded-md font-medium text-foreground hover:bg-muted/50 transition-colors">
                            Read Article
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
