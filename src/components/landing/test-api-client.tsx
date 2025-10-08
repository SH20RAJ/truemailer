"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export function TestAPIClient() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const testEmails = [
        "user@gmail.com",
        "test@temp-mail.org",
        "admin@10minutemail.com",
        "info@company.com",
        "spam@guerrillamail.com"
    ];

    const validateEmail = async (emailToTest: string) => {
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(`/api/validate?email=${encodeURIComponent(emailToTest)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error((data as any)?.error || 'Validation failed'); // eslint-disable-line @typescript-eslint/no-explicit-any
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            validateEmail(email.trim());
        }
    };

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="min-h-screen bg-background pt-16">
            {/* Header */}
            <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Test Email Validation API</h1>
                            <p className="text-muted-foreground">
                                Try our email validation API with real disposable email detection
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Test Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Validation Test</CardTitle>
                                <p className="text-muted-foreground">
                                    Enter an email address to test our validation API
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Email Address
                                        </label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="test@example.com"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Validating...
                                            </>
                                        ) : (
                                            'Validate Email'
                                        )}
                                    </Button>
                                </form>

                                <div className="pt-4 border-t">
                                    <p className="text-sm font-medium mb-3">Quick Test Examples:</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {testEmails.map((testEmail) => (
                                            <Button
                                                key={testEmail}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => validateEmail(testEmail)}
                                                disabled={loading}
                                                className="justify-start text-left"
                                            >
                                                {testEmail}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Validation Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                        <p className="font-medium">Error:</p>
                                        <p>{error}</p>
                                    </div>
                                )}

                                {result && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge
                                                variant={result.valid ? "default" : "destructive"}
                                                className={result.valid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                                            >
                                                {result.valid ? "✅ Valid" : "❌ Invalid"}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={getRiskColor(result.risk_level)}
                                            >
                                                {result.risk_level.toUpperCase()} RISK
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Email:</span>
                                                <p className="font-mono">{result.email}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Domain:</span>
                                                <p className="font-mono">{result.domain}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Disposable:</span>
                                                <p className={result.disposable ? "text-red-400" : "text-green-400"}>
                                                    {result.disposable ? "Yes" : "No"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Role-based:</span>
                                                <p className={result.role_based ? "text-yellow-400" : "text-green-400"}>
                                                    {result.role_based ? "Yes" : "No"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Allowed List:</span>
                                                <p className={result.allowed_list ? "text-green-400" : "text-muted-foreground"}>
                                                    {result.allowed_list ? "Yes" : "No"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Free Provider:</span>
                                                <p className={result.free_provider ? "text-yellow-400" : "text-muted-foreground"}>
                                                    {result.free_provider ? "Yes" : "No"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <p className="text-sm font-medium mb-2">Reason:</p>
                                            <p className="text-sm text-muted-foreground">{result.reason}</p>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <p className="text-sm font-medium mb-2">Response Time:</p>
                                            <p className="text-sm text-muted-foreground">{result.response_time}ms</p>
                                        </div>
                                    </div>
                                )}

                                {!result && !error && !loading && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Enter an email address to see validation results</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* API Documentation */}
                <div className="mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>API Usage Examples</CardTitle>
                            <p className="text-muted-foreground">
                                See how to integrate our API into your application
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">cURL Request</h3>
                                <CodeBlock 
                                    code={`curl "https://truemailer.strivio.world/api/validate?email=test@example.com"`}
                                    language="bash"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">JavaScript (Fetch)</h3>
                                <CodeBlock 
                                    code={`const response = await fetch('https://truemailer.strivio.world/api/validate?email=test@example.com');
const data = await response.json();
console.log(data);`}
                                    language="javascript"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Python (Requests)</h3>
                                <CodeBlock 
                                    code={`import requests

response = requests.get('https://truemailer.strivio.world/api/validate', 
                       params={'email': 'test@example.com'})
data = response.json()
print(data)`}
                                    language="python"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Response Format</h3>
                                <CodeBlock 
                                    code={`{
  "email": "test@example.com",
  "domain": "example.com",
  "valid": true,
  "disposable": false,
  "role_based": false,
  "allowed_list": false,
  "free_provider": false,
  "risk_level": "low",
  "reason": "Valid email address",
  "response_time": 45
}`}
                                    language="json"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}