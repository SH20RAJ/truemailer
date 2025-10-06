import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-foreground">TrueMailer</span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Professional email validation API that keeps spam out and ensures deliverability. 
              Privacy-first with zero data storage.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Open Source & Free
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <div className="space-y-3">
              <Link href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/test-api" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Playground
              </Link>
              <Link href="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="https://github.com/sh20raj/truemailer#api-usage" target="_blank" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                API Docs
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <div className="space-y-3">
              <Link href="https://github.com/sh20raj/truemailer" target="_blank" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </Link>
              <Link href="https://github.com/sh20raj/truemailer/issues" target="_blank" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Issues
              </Link>
              <Link href="/help-improve" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help Improve
              </Link>
              <Link href="https://github.com/sh20raj/truemailer/blob/main/LICENSE" target="_blank" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                License
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TrueMailer. MIT Licensed.</p>
          <div className="flex items-center gap-1 mt-2 md:mt-0">
            Built with ❤️ for developers
          </div>
        </div>
      </div>
    </footer>
  );
}