import Link from "next/link";
import { Search } from "lucide-react";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <span className="font-black text-2xl tracking-tighter uppercase relative inline-block">
                        7BEB
                        <span className="absolute -top-1 -right-3 h-2 w-2 rounded-full bg-primary" />
                    </span>
                </Link>

                {/* Search */}
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </button>
            </div>
        </nav>
    );
}

