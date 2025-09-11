import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            TruMailer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10">
            A lightweight and fast <span className="font-semibold text-foreground">email validation API</span> built to help developers check whether an email address is valid, disposable, role-based, or spammy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="#api-usage">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/sh20raj/trumailer" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">🚀 Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for comprehensive email validation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold mb-2">✅ Syntax Validation</div>
            <p className="text-muted-foreground">RFC compliant email syntax checking</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold mb-2">📨 MX Record Lookup</div>
            <p className="text-muted-foreground">Checks if domain can receive mail</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold mb-2">🛑 Disposable Email Detection</div>
            <p className="text-muted-foreground">Identifies tempmail, 10minutemail, etc.</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold mb-2">👥 Role-based Email Detection</div>
            <p className="text-muted-foreground">Detects admin@, support@, info@, etc.</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold mb-2">⚡ REST API</div>
            <p className="text-muted-foreground">JSON responses for easy integration</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold mb-2">🔒 Privacy First</div>
            <p className="text-muted-foreground">No data stored - lightweight and secure</p>
          </div>
        </div>
      </div>

      {/* API Usage Section */}
      <div id="api-usage" className="container mx-auto px-4 py-16 md:py-24 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">🔌 API Usage</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple integration with your applications
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Validate an email</h3>
            <div className="bg-muted p-4 rounded-md mb-4">
              <code className="text-sm">GET /validate?email=example@gmail.com</code>
            </div>
            
            <h4 className="text-lg font-semibold mb-2">Response</h4>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  "email": "example@gmail.com",
  "valid_syntax": true,
  "mx_found": true,
  "disposable": false,
  "role_based": false
}`}</pre>
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="https://github.com/sh20raj/trumailer#-api-usage" target="_blank">
                View Full Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">🛠 Tech Stack</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies for maximum performance
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-card rounded-lg border p-6">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Hono</h3>
            <p className="text-muted-foreground">Fast edge framework</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="text-5xl mb-4">☁️</div>
            <h3 className="text-xl font-bold mb-2">Cloudflare</h3>
            <p className="text-muted-foreground">Workers / Node.js</p>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="text-5xl mb-4">📡</div>
            <h3 className="text-xl font-bold mb-2">DNS</h3>
            <p className="text-muted-foreground">MX record lookups</p>
          </div>
        </div>
      </div>

      {/* Installation Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">📦 Installation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with TruMailer in just a few steps
            </p>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-bold mb-4">Clone the repo:</h3>
            <pre className="bg-muted p-4 rounded-md mb-6">
{`git clone https://github.com/sh20raj/trumailer.git
cd trumailer`}
            </pre>
            
            <h3 className="text-xl font-bold mb-4">Install dependencies:</h3>
            <pre className="bg-muted p-4 rounded-md mb-6">
              npm install
            </pre>
            
            <h3 className="text-xl font-bold mb-4">Start server:</h3>
            <pre className="bg-muted p-4 rounded-md mb-6">
              npm run dev
            </pre>
            
            <p className="text-muted-foreground">
              By default, it runs at <code className="bg-muted px-2 py-1 rounded">http://localhost:3000</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-4 md:mb-0">TruMailer</div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="https://github.com/sh20raj/trumailer" target="_blank" className="text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
            <Link href="#api-usage" className="text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
            <Link href="https://github.com/sh20raj/trumailer/issues" target="_blank" className="text-muted-foreground hover:text-foreground">
              Issues
            </Link>
          </div>
        </div>
        <div className="text-center mt-8 text-muted-foreground">
          <p>MIT © 2025 TruMailer</p>
        </div>
      </footer>
    </div>
  );
}