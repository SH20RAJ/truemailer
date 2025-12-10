import { Metadata } from 'next';
import Link from 'next/link';
import { Book, Code, Terminal, Zap, Shield, Globe } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Documentation - TrueMailer',
    description: 'Learn how to integrate TrueMailer API into your applications.',
};

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            TrueMailer Documentation
                        </h1>
                        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to integrate professional email validation into your applications.
                            Reliable, fast, and secure.
                        </p>
                        <div className="mt-10 flex gap-4 justify-center">
                            <Link href="/dashboard" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                                Get API Keys
                            </Link>
                            <Link href="#quick-start" className="px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors font-medium">
                                Quick Start
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card
                        icon={<Zap className="w-6 h-6 text-yellow-500" />}
                        title="Real-time Validation"
                        description="Verify email addresses instantly via our high-performance REST API."
                    />
                    <Card
                        icon={<Shield className="w-6 h-6 text-green-500" />}
                        title="Spam Trap Detection"
                        description="Identify and block disposable emails and known spam traps automatically."
                    />
                    <Card
                        icon={<Terminal className="w-6 h-6 text-blue-500" />}
                        title="Developer Friendly"
                        description="Simple JSON responses, comprehensive SDKs, and detailed error messages."
                    />
                </div>
            </div>

            {/* Documentation Content */}
            <div id="quick-start" className="container mx-auto px-4 py-16 border-t border-border/40">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">Quick Start</h2>

                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-semibold mb-4">1. Get your API Key</h3>
                        <p className="mb-6 text-muted-foreground">
                            Sign up for an account and navigate to the <Link href="/dashboard/keys" className="text-primary hover:underline">API Keys</Link> section to generate your first secret key.
                        </p>

                        <h3 className="text-xl font-semibold mb-4">2. Make a Request</h3>
                        <p className="mb-4 text-muted-foreground">
                            Send a GET request to validate an email address. Replace <code>YOUR_API_KEY</code> with your actual key.
                        </p>

                        <div className="bg-muted/50 rounded-lg p-6 border border-border mb-8 overflow-x-auto">
                            <code className="text-sm font-mono text-blue-400">
                                curl -X GET "https://api.truemailer.com/v1/validate?email=test@example.com" \<br />
                                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                            </code>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">3. Response</h3>
                        <div className="bg-muted/50 rounded-lg p-6 border border-border overflow-x-auto">
                            <pre className="text-sm font-mono text-green-400">
                                {`{
  "email": "test@example.com",
  "is_valid": true,
  "score": 0.95,
  "details": {
    "domain": "example.com",
    "is_disposable": false,
    "is_role_account": false,
    "mx_records": true
  }
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-xl border border-border bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <div className="mb-4 p-3 rounded-lg bg-background w-fit border border-border">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
