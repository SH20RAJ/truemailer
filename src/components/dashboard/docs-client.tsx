"use client";

import { useState } from "react";
import { BookOpen, Copy, Check } from "lucide-react";
import { Button } from "rizzui";

export function DocsClient() {
  const [activeTab, setActiveTab] = useState("curl");
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const curlExample = `curl -X POST https://truemailer.strivio.world/api/v2/validate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: tm_your_api_key_here" \\
  -d '{"email": "test@example.com"}'`;

  const javascriptExample = `const response = await fetch('https://truemailer.strivio.world/api/v2/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'tm_your_api_key_here'
  },
  body: JSON.stringify({ email: 'test@example.com' })
});

const result = await response.json();
console.log(result);`;

  const pythonExample = `import requests

response = requests.post(
    'https://truemailer.strivio.world/api/v2/validate',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': 'tm_your_api_key_here'
    },
    json={'email': 'test@example.com'}
)

result = response.json()
print(result)`;

  const jsonResponse = `{ 
  "email": "test@example.com",
  "domain": "example.com",
  "valid": true,
  "syntax_valid": true,
  "disposable": false,
  "role_based": false,
  "mx_records": true,
  "spammy": false,
  "allowed_list": false,
  "confidence_score": 0.95,
  "risk_level": "low",
  "suggestions": [],
  "personal_override": false,
  "reason": "Valid email",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "cache_info": {
    "disposable_domains_count": 12847,
    "allowed_domains_count": 156,
    "last_updated": "2024-01-15T08:00:00.000Z"
  }
}`;

  return (
    <div className="space-y-6">
      <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Getting Started</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">1. Create an API Key</h4>
            <p className="text-sm text-muted-foreground">
              Go to the{' '}
              <a href="/dashboard/keys" className="text-primary hover:underline">
                API Keys
              </a>{' '}
              tab and create your first API key. Choose a descriptive name and set your monthly quota.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">2. Make Your First Request</h4>
            <p className="text-sm text-muted-foreground">
              Use the{' '}
              <a href="/dashboard/playground" className="text-primary hover:underline">
                Playground
              </a>{' '}
              to test your API key, or make a POST request to{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/v2/validate</code> with your API key in the{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">X-API-Key</code> header.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">3. Monitor Usage</h4>
            <p className="text-sm text-muted-foreground">
              Track your API usage and monitor your monthly quota in the{' '}
              <a href="/dashboard/overview" className="text-primary hover:underline">
                Overview
              </a>{' '}
              section.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-primary/10">
          <h3 className="text-xl font-bold">API Reference</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Endpoint</h4>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">POST /api/v2/validate</div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Headers</h4>
            <div className="space-y-1">
              <div className="bg-muted p-3 rounded-md font-mono text-sm">Content-Type: application/json</div>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">X-API-Key: tm_your_api_key</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Request Body</h4>
            <pre className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
              {`{
  "email": "test@example.com"
}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-primary/10">
          <h3 className="text-xl font-bold">Code Examples</h3>
        </div>
        <div className="p-6">
          <div className="w-full">
            <div className="flex space-x-2 bg-muted/50 p-1 rounded-lg mb-4 w-fit">
              {['curl', 'javascript', 'python'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/50"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>
                  {activeTab === 'curl' && curlExample}
                  {activeTab === 'javascript' && javascriptExample}
                  {activeTab === 'python' && pythonExample}
                </code>
              </pre>
              <Button
                size="sm"
                variant="flat"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => copyToClipboard(
                  activeTab === 'curl' ? curlExample : activeTab === 'javascript' ? javascriptExample : pythonExample,
                  activeTab
                )}
              >
                {copied === activeTab ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-primary/10">
          <h3 className="text-xl font-bold">Example Response</h3>
        </div>
        <div className="p-6">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            <code>{jsonResponse}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
