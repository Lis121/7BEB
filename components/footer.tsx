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
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <p>&copy; {new Date().getFullYear()} 7BEB. All rights reserved.</p>
                    <nav className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
