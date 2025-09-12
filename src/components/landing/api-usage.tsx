import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiUsage() {
  return (
    <div id="api-usage" className="container mx-auto px-4 py-16 md:py-24 bg-muted/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">🔌 API Usage</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Simple integration with your applications
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Validate an email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md mb-4">
              <code className="text-sm">GET /validate?email=example@gmail.com</code>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  "email": "example@gmail.com",
  "valid_syntax": true,
  "mx_found": true,
  "disposable": false,
  "role_based": false
}`}</pre>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link href="https://github.com/sh20raj/truemailer#-api-usage" target="_blank">
              View Full Documentation
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}