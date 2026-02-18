export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-card py-12 mt-auto">
            <div className="container mx-auto px-4 flex flex-col items-center gap-6 text-center">
                {/* Brand */}
                <div className="space-y-2">
                    <span className="font-black text-2xl tracking-tighter uppercase relative inline-block">
                        7BEB
                        <span className="absolute -top-1 -right-3 h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Your trusted source for the latest news and video coverage.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-12 h-px bg-border/60" />

                {/* Links & Copyright */}
                {/* Links & Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <p>&copy; {new Date().getFullYear()} 7BEB. All rights reserved.</p>

                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <a href="/politics" className="hover:text-primary transition-colors">Politics</a>
                        <a href="/business" className="hover:text-primary transition-colors">Business</a>
                        <a href="/tech" className="hover:text-primary transition-colors">Tech</a>
                        <a href="/science" className="hover:text-primary transition-colors">Science</a>
                        <a href="/health" className="hover:text-primary transition-colors">Health</a>
                        <a href="/sports" className="hover:text-primary transition-colors">Sports</a>
                        <a href="/entertainment" className="hover:text-primary transition-colors">Entertainment</a>
                        <a href="/world" className="hover:text-primary transition-colors">World</a>
                    </nav>

                    <nav className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
