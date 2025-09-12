import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-4 md:mb-0 text-gradient">
            TrueMailer
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="https://github.com/sh20raj/truemailer" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </Link>
            <Link href="https://github.com/sh20raj/truemailer#api-usage" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link href="https://github.com/sh20raj/truemailer/issues" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              Issues
            </Link>
            <Link href="https://github.com/sh20raj/truemailer/blob/main/LICENSE" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              License
            </Link>
          </div>
        </div>
        <div className="text-center mt-8 text-muted-foreground text-sm">
          <p>MIT © {new Date().getFullYear()} TrueMailer. Built with ❤️ for developers.</p>
        </div>
      </div>
    </footer>
  );
}