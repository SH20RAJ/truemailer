"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Loader2,
    Mail,
    Shield,
    AlertTriangle,
    CheckCircle,
    Copy,
    Download,
    Upload,
    Trash2,
    Play,
    History
} from "lucide-react";
import Link from "next/link";



interface ValidationResult {
    email: string;
    domain: string;
    valid: boolean;
    valid_syntax: boolean;
    mx_found: boolean;
    disposable: boolean;
    role_based: boolean;
    spammy: boolean;
    allowed_list: boolean;
    confidence_score: number;
    risk_level: string;
    suggestions: string[];
    timestamp?: string;
}

interface BatchResult {
    success: boolean;
    summary: {
        total: number;
        valid: number;
        invalid: number;
        disposable: number;
        role_based: number;
        allowed_list: number;
        high_risk: number;
        medium_risk: number;
        low_risk: number;
    };
    results: ValidationResult[];
}

export default function PlaygroundPage() {
    const [activeTab, setActiveTab] = useState<"single" | "batch">("single");
    const [email, setEmail] = useState("");
    const [batchEmails, setBatchEmails] = useState("");
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [history, setHistory] = useState<ValidationResult[]>([]);

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('truemailer-history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error('Failed to load history:', e);
            }
        }
    }, []);

    // Save to history
    const saveToHistory = (result: ValidationResult) => {
        const newHistory = [result, ...history.slice(0, 9)]; // Keep last 10
        setHistory(newHistory);
        localStorage.setItem('truemailer-history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('truemailer-history');
    };

    const validateSingleEmail = async (emailToTest: string) => {
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(`/api/validate?email=${encodeURIComponent(emailToTest)}`);
            const data = await response.json() as ValidationResult;

            if (!response.ok) {
                throw new Error((data as any)?.error || 'Validation failed'); // eslint-disable-line @typescript-eslint/no-explicit-any
            }

            setResult(data);
            saveToHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const validateBatchEmails = async () => {
        setLoading(true);
        setError("");
        setBatchResult(null);

        const emails = batchEmails
            .split('\n')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        if (emails.length === 0) {
            setError('Please enter at least one email address');
            setLoading(false);
            return;
        }

        if (emails.length > 100) {
            setError('Maximum 100 emails allowed per batch');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/validate-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails })
            });

            const data = await response.json() as BatchResult;

            if (!response.ok) {
                throw new Error((data as any).error || 'Batch validation failed'); // eslint-disable-line @typescript-eslint/no-explicit-any
            }

            setBatchResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSingleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            validateSingleEmail(email.trim());
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const exportResults = () => {
        const data = activeTab === 'single' ? result : batchResult;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `truemailer-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const quickTestEmails = [
        { email: "user@gmail.com", label: "Valid Gmail" },
        { email: "test@temp-mail.org", label: "Disposable" },
        { email: "admin@10minutemail.com", label: "Temp Email" },
        { email: "support@company.com", label: "Role-based" },
        { email: "invalid-email", label: "Invalid Format" }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <Play className="h-6 w-6 text-primary" />
                                    Email Validation Playground
                                </h1>
                                <p className="text-muted-foreground">
                                    Interactive testing environment for email validation API
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {(result || batchResult) && (
                                <Button variant="outline" size="sm" onClick={exportResults}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Results
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Testing Area */}
                    <div className="xl:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Email Validation Testing
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "single" | "batch")}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="single" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Single Email
                                        </TabsTrigger>
                                        <TabsTrigger value="batch" className="flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            Batch Validation
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="single" className="mt-6">
                                        <form onSubmit={handleSingleSubmit} className="space-y-4">
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
                                                    className="text-lg"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={loading}
                                                size="lg"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Validating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Validate Email
                                                    </>
                                                )}
                                            </Button>
                                        </form>

                                        {/* Quick Test Buttons */}
                                        <div className="mt-6 pt-6 border-t">
                                            <p className="text-sm font-medium mb-3">Quick Test Examples:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {quickTestEmails.map((test) => (
                                                    <Button
                                                        key={test.email}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEmail(test.email);
                                                            validateSingleEmail(test.email);
                                                        }}
                                                        disabled={loading}
                                                        className="justify-start text-left h-auto py-2"
                                                    >
                                                        <div>
                                                            <div className="font-mono text-xs">{test.email}</div>
                                                            <div className="text-xs text-muted-foreground">{test.label}</div>
                                                        </div>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="batch" className="mt-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Email Addresses (one per line, max 100)
                                                </label>
                                                <Textarea
                                                    value={batchEmails}
                                                    onChange={(e) => setBatchEmails(e.target.value)}
                                                    placeholder={`user1@gmail.com\ntest@temp-mail.org\nadmin@company.com\nspam@guerrillamail.com`}
                                                    rows={8}
                                                    className="font-mono"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {batchEmails.split('\n').filter(e => e.trim()).length} emails entered
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={validateBatchEmails}
                                                    className="flex-1"
                                                    disabled={loading}
                                                    size="lg"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Validate Batch
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setBatchEmails('')}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {/* Error Display */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                                    >
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" />
                                            <p className="font-medium">Error:</p>
                                        </div>
                                        <p className="mt-1">{error}</p>
                                    </motion.div>
                                )}

                                {/* Single Email Results */}
                                {result && activeTab === 'single' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Validation Results</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy JSON
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
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

                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Email:</span>
                                                                <span className="font-mono">{result.email}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Domain:</span>
                                                                <span className="font-mono">{result.domain}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Confidence:</span>
                                                                <span className="font-semibold">{(result.confidence_score * 100).toFixed(0)}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Disposable:</span>
                                                            <span className={result.disposable ? "text-red-400" : "text-green-400"}>
                                                                {result.disposable ? "Yes" : "No"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Role-based:</span>
                                                            <span className={result.role_based ? "text-yellow-400" : "text-green-400"}>
                                                                {result.role_based ? "Yes" : "No"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Allowed List:</span>
                                                            <span className={result.allowed_list ? "text-green-400" : "text-gray-400"}>
                                                                {result.allowed_list ? "Yes" : "No"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">MX Records:</span>
                                                            <span className={result.mx_found ? "text-green-400" : "text-red-400"}>
                                                                {result.mx_found ? "Found" : "Not Found"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {result.suggestions && result.suggestions.length > 0 && (
                                            <Card>
                                                <CardContent className="p-4">
                                                    <h4 className="font-medium mb-2">Suggestions:</h4>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {result.suggestions.map((suggestion, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-primary">•</span>
                                                                {suggestion}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        )}

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Raw API Response</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                                                    <code>{JSON.stringify(result, null, 2)}</code>
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Batch Results */}
                                {batchResult && activeTab === 'batch' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Batch Validation Results</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(JSON.stringify(batchResult, null, 2))}
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy JSON
                                            </Button>
                                        </div>

                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <Card>
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-primary">{batchResult.summary.total}</div>
                                                    <div className="text-sm text-muted-foreground">Total</div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-green-400">{batchResult.summary.valid}</div>
                                                    <div className="text-sm text-muted-foreground">Valid</div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-red-400">{batchResult.summary.disposable}</div>
                                                    <div className="text-sm text-muted-foreground">Disposable</div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-yellow-400">{batchResult.summary.role_based}</div>
                                                    <div className="text-sm text-muted-foreground">Role-based</div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Individual Results */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Individual Results</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                                    {batchResult.results.map((result, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-mono text-sm">{result.email}</span>
                                                                    <Badge
                                                                        variant={result.valid ? "default" : "destructive"}
                                                                        className={`text-xs ${result.valid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                                                                    >
                                                                        {result.valid ? "Valid" : "Invalid"}
                                                                    </Badge>
                                                                    {result.disposable && (
                                                                        <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400">
                                                                            Disposable
                                                                        </Badge>
                                                                    )}
                                                                    {result.role_based && (
                                                                        <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400">
                                                                            Role-based
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Confidence: {(result.confidence_score * 100).toFixed(0)}% • Risk: {result.risk_level}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* History */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <History className="h-4 w-4" />
                                        Recent Tests
                                    </CardTitle>
                                    {history.length > 0 && (
                                        <Button variant="ghost" size="sm" onClick={clearHistory}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {history.length > 0 ? (
                                    <div className="space-y-2">
                                        {history.slice(0, 5).map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => {
                                                    setEmail(item.email);
                                                    setResult(item);
                                                    setActiveTab('single');
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-xs truncate">{item.email}</span>
                                                    <Badge
                                                        variant={item.valid ? "default" : "destructive"}
                                                        className={`text-xs ${item.valid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                                                    >
                                                        {item.valid ? "✓" : "✗"}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {item.risk_level} risk • {(item.confidence_score * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No recent tests
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* API Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">API Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <span className="font-medium">Single Validation:</span>
                                    <p className="text-muted-foreground font-mono text-xs mt-1">
                                        GET /api/validate?email=...
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium">Batch Validation:</span>
                                    <p className="text-muted-foreground font-mono text-xs mt-1">
                                        POST /api/validate-batch
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium">Rate Limits:</span>
                                    <p className="text-muted-foreground text-xs mt-1">
                                        No limits currently applied
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium">Data Sources:</span>
                                    <p className="text-muted-foreground text-xs mt-1">
                                        12,000+ disposable domains from GitHub
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href="/test-api">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Shield className="h-4 w-4 mr-2" />
                                        API Testing Page
                                    </Button>
                                </Link>
                                <Link href="/#quick-integration">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Integration Guide
                                    </Button>
                                </Link>
                                <Link href="/help-improve">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Help Improve
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}