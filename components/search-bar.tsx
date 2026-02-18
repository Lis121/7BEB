"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={containerRef} className="relative flex items-center">
            <form
                onSubmit={handleSearch}
                className={cn(
                    "absolute right-0 flex items-center bg-background border border-border/50 rounded-full overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "w-56 opacity-100 pr-2" : "w-0 opacity-0 border-none"
                )}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-9 pl-4 pr-2 bg-transparent outline-none text-sm"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="p-1 hover:bg-muted rounded-full"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
            </form>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative z-10 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50",
                    isOpen && "bg-muted/50 text-foreground"
                )}
                aria-label="Search"
            >
                <Search className="h-5 w-5" />
            </button>
        </div>
    );
}
