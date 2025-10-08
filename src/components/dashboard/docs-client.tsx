"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";
import { BookOpen } from "lucide-react";

export function DocsClient() {
  const curlExample = `curl -X POST https://truemailer.strivio.world/api/v2/validate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tm_your_api_key_here" \
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Endpoint</h4>
            <CodeBlock language="bash" value="POST /api/v2/validate" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Headers</h4>
            <div className="space-y-1">
              <CodeBlock language="bash" value="Content-Type: application/json" />
              <CodeBlock language="bash" value="X-API-Key: tm_your_api_key" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Request Body</h4>
            <CodeBlock language="json" value={`{
  "email": "test@example.com"
}`}/>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl" className="w-full">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="curl">
              <CodeBlock language="bash" value={curlExample} />
            </TabsContent>
            <TabsContent value="javascript">
              <CodeBlock language="javascript" value={javascriptExample} />
            </TabsContent>
            <TabsContent value="python">
              <CodeBlock language="python" value={pythonExample} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Response</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock language="json" value={jsonResponse} />
        </CardContent>
      </Card>
    </div>
  );
}
