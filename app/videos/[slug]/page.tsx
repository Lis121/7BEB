import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, Share2, Clock } from "lucide-react";
import { notFound } from "next/navigation";

export const runtime = 'edge';

export default async function VideoDate({ params }: { params: Promise<{ slug: string }> }) {
    // In a real app, fetch data based on params.slug
    const { slug } = await params;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                            {/* Mock Video Player */}
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                                title="Video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold leading-tight">Senate Passes Historic Infrastructure Bill After Marathon Session</h1>
                                <div className="flex items-center space-x-4 mt-3 text-muted-foreground text-sm">
                                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> 10 mins ago</span>
                                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Oct 24, 2023</span>
                                    <span className="text-primary font-medium">Politics</span>
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed text-muted-foreground">
                                In a decisive late-night vote, the Senate approved the sweeping 1.2 trillion dollar package, marking a major victory for the administration's domestic agenda. The bill includes funding for roads, bridges, broadband, and water infrastructure.
                            </p>

                            <div className="flex items-center space-x-4 pt-4 border-t border-border/50">
                                <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                                    <Share2 className="h-5 w-5" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Recommended */}
                    <aside className="space-y-6">
                        <h2 className="font-bold text-xl">Up Next</h2>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-3 group cursor-pointer">
                                    <div className="relative w-40 aspect-video bg-muted rounded-md overflow-hidden flex-shrink-0">
                                        <img src={`https://images.unsplash.com/photo-${i === 1 ? '1497215728101-856f4ea42174' : '1451187580459-43490279c0fa'}?q=80&w=400&auto=format&fit=crop`} className="object-cover w-full h-full group-hover:scale-105 transition-transform" alt="Thumbnail" />
                                    </div >
    <div>
        <h4 className="font-medium line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            Global Markets React to Fed Interest Rate Decision
        </h4>
        <p className="text-xs text-muted-foreground mt-1">Business • 2h ago</p>
    </div>
                                </div >
                            ))}
                        </div >
                    </aside >

                </div >
            </main >

    <Footer />
        </div >
    );
}
