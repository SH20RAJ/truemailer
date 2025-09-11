import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Installation() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">📦 Installation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with TruMailer in just a few steps
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Clone the repo:</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md mb-6">
{`git clone https://github.com/sh20raj/trumailer.git
cd trumailer`}
            </pre>
            
            <CardTitle className="mb-4">Install dependencies:</CardTitle>
            <pre className="bg-muted p-4 rounded-md mb-6">
              npm install
            </pre>
            
            <CardTitle className="mb-4">Start server:</CardTitle>
            <pre className="bg-muted p-4 rounded-md mb-6">
              npm run dev
            </pre>
            
            <p className="text-muted-foreground">
              By default, it runs at <code className="bg-muted px-2 py-1 rounded">http://localhost:3000</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}