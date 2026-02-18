import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

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

                {/* Navigation */}
                <div className="hidden md:flex items-center space-x-4 text-sm font-medium uppercase tracking-wider">
                    <Link href="/politics" className="hover:text-primary transition-colors">
                        Politics
                    </Link>
                    <Link href="/business" className="hover:text-primary transition-colors">
                        Business
                    </Link>
                    <Link href="/tech" className="hover:text-primary transition-colors">
                        Tech
                    </Link>
                    <Link href="/science" className="hover:text-primary transition-colors">
                        Science
                    </Link>
                    <Link href="/health" className="hover:text-primary transition-colors">
                        Health
                    </Link>
                    <Link href="/sports" className="hover:text-primary transition-colors">
                        Sports
                    </Link>
                    <Link href="/entertainment" className="hover:text-primary transition-colors">
                        Entertainment
                    </Link>
                    <Link href="/world" className="hover:text-primary transition-colors">
                        World
                    </Link>
                </div>

                {/* Search */}
                <SearchBar />
            </div>
        </nav>
    );
}

