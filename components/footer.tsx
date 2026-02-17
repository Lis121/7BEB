export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg tracking-tight">7BEB</span>
                </div>
                <div className="text-sm text-muted-foreground text-center md:text-right">
                    <p>&copy; {new Date().getFullYear()} 7BEB. All rights reserved.</p>
                    <div className="flex space-x-4 mt-2 justify-center md:justify-end">
                        <a href="#" className="hover:text-foreground">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
