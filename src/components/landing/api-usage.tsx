import { Button } from "rizzui";
import Link from "next/link";
import { useEffect } from "react";

declare global {
  interface Window {
    hljs: any;
  }
}

export function ApiUsage() {
  useEffect(() => {
    if (window.hljs) {
      window.hljs.highlightAll();
    }
  }, []);

  return (
    <div id="api-usage" className="container mx-auto px-4 py-16 md:py-24 bg-muted/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">🔌 API Usage</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Simple integration with your applications
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-primary/10">
            <h3 className="text-xl font-bold">Validate an email</h3>
          </div>
          <div className="p-6">
            <div className="bg-muted p-4 rounded-md mb-4">
              <code className="text-sm">GET /validate?email=example@gmail.com</code>
            </div>

            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className="language-json">
{`{
  "email": "example@gmail.com",
  "valid_syntax": true,
  "mx_found": true,
  "disposable": false,
  "role_based": false
}`}
              </code>
            </pre>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button size="lg" as={Link} href="https://github.com/sh20raj/truemailer#-api-usage" target="_blank">
            View Full Documentation
          </Button>
        </div>
      </div>
    </div>
  );
}