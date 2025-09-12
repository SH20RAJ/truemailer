import Link from "next/link";

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-12 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold mb-4 md:mb-0">TrueMailer</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="https://github.com/sh20raj/truemailer" target="_blank" className="text-muted-foreground hover:text-foreground">
            GitHub
          </Link>
          <Link href="#api-usage" className="text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
          <Link href="https://github.com/sh20raj/truemailer/issues" target="_blank" className="text-muted-foreground hover:text-foreground">
            Issues
          </Link>
        </div>
      </div>
      <div className="text-center mt-8 text-muted-foreground">
        <p>MIT © 2025 TrueMailer</p>
      </div>
    </footer>
  );
}