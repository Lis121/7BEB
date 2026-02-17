"use client";

import Link from "next/link";
import { Search, Menu, X, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground p-1 rounded">
                        <Play className="h-5 w-5 fill-current" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">7BEB</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <Link href="/politics" className="hover:text-foreground transition-colors">Politics</Link>
                    <Link href="/tech" className="hover:text-foreground transition-colors">Tech</Link>
                    <Link href="/business" className="hover:text-foreground transition-colors">Business</Link>
                    <Link href="/entertainment" className="hover:text-foreground transition-colors">Entertainment</Link>
                </div>

                {/* Search & Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </button>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        Subscribe
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border/40 bg-background">
                    <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                        <Link href="/" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link href="/politics" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Politics</Link>
                        <Link href="/tech" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Tech</Link>
                        <Link href="/business" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Business</Link>
                        <Link href="/entertainment" className="text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Entertainment</Link>
                        <div className="pt-4 flex items-center justify-between border-t border-border/40">
                            <button className="flex items-center space-x-2 text-muted-foreground">
                                <Search className="h-5 w-5" />
                                <span className="text-sm">Search</span>
                            </button>
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
