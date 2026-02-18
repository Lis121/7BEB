"use client";

import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group shrink-0">
                    <span className="font-black text-2xl tracking-tighter uppercase relative inline-block">
                        7BEB
                        <span className="absolute -top-1 -right-3 h-2 w-2 rounded-full bg-primary" />
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4 text-sm font-medium uppercase tracking-wider">
                    <NavLinks />
                </div>

                {/* Right Side: Search & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    <SearchBar />

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-background">
                    <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                        <NavLinks onClick={() => setIsMenuOpen(false)} />
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
    const links = [
        { href: "/politics", label: "Politics" },
        { href: "/business", label: "Business" },
        { href: "/tech", label: "Tech" },
        { href: "/science", label: "Science" },
        { href: "/health", label: "Health" },
        { href: "/sports", label: "Sports" },
        { href: "/entertainment", label: "Entertainment" },
        { href: "/world", label: "World" },
    ];

    return (
        <>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-primary transition-colors block py-2 md:py-0"
                    onClick={onClick}
                >
                    {link.label}
                </Link>
            ))}
        </>
    );
}

