"use client";

import { useState, useEffect } from "react";
import { Button, Input, Textarea, Badge, Title, Text } from "rizzui";
import { ArrowLeft, Loader2, Mail, Upload, Play, Download, Copy, History } from "lucide-react";
import Link from "next/link";

interface ValidationResult {
  email: string; domain: string; valid: boolean; valid_syntax: boolean; mx_found: boolean; disposable: boolean; role_based: boolean; spammy: boolean; allowed_list: boolean; confidence_score: number; risk_level: string; suggestions: string[]; timestamp?: string;
}
interface BatchResult { success: boolean; summary: { total: number; valid: number; invalid: number; disposable: number; role_based: number; allowed_list: number; high_risk: number; medium_risk: number; low_risk: number; }; results: ValidationResult[]; }

export default function StandalonePlaygroundClient() {
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");
  const [email, setEmail] = useState("");
  const [batchEmails, setBatchEmails] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
  const [history, setHistory] = useState<ValidationResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('truemailer-history');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch { } }
  }, []);

  const saveToHistory = (r: ValidationResult) => {
    const next = [r, ...history.slice(0, 9)];
    setHistory(next);
    localStorage.setItem('truemailer-history', JSON.stringify(next));
  };

  const clearHistory = () => { setHistory([]); localStorage.removeItem('truemailer-history'); };

  const validateSingleEmail = async (value: string) => {
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch(`/api/validate?email=${encodeURIComponent(value)}`);
      const data = await response.json() as ValidationResult | { error?: string };
      if (!response.ok) throw new Error(("error" in data && data.error) || 'Validation failed');
      setResult(data as ValidationResult); saveToHistory(data as ValidationResult);
    } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred'); }
    finally { setLoading(false); }
  };

  const validateBatchEmails = async () => {
    setLoading(true); setError(""); setBatchResult(null);
    const emails = batchEmails.split('\n').map(e => e.trim()).filter(Boolean);
    if (emails.length > 100) { setError('Maximum 100 emails allowed per batch'); setLoading(false); return; }
    try {
      const response = await fetch('/api/validate-batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emails }) });
      const data = await response.json() as BatchResult | { error?: string };
      if (!response.ok) throw new Error(("error" in data && data.error) || 'Batch validation failed');
      setBatchResult(data as BatchResult);
    } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred'); }
    finally { setLoading(false); }
  };

  const handleSingleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email.trim()) validateSingleEmail(email.trim()); };
  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); };
  const exportResults = () => { const data = activeTab === 'single' ? result : batchResult; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `truemailer-results-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="text" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button></Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><Play className="h-6 w-6 text-primary" />Email Validation Playground</h1>
                <p className="text-muted-foreground">Interactive testing environment for email validation API</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(result || batchResult) && (<Button variant="outline" size="sm" onClick={exportResults}><Download className="h-4 w-4 mr-2" />Export Results</Button>)}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="bg-card/50 border border-primary/20 rounded-xl">
              <div className="p-6 border-b border-primary/10">
                <Title as="h2" className="flex items-center gap-2"><Mail className="h-5 w-5" />Email Validation Testing</Title>
              </div>
              <div className="p-6">
                {/* Custom Tabs */}
                <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg mb-6 w-fit">
                  <button
                    onClick={() => setActiveTab("single")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "single"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                      }`}
                  >
                    <Mail className="h-4 w-4" />Single Email
                  </button>
                  <button
                    onClick={() => setActiveTab("batch")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "batch"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                      }`}
                  >
                    <Upload className="h-4 w-4" />Batch Validation
                  </button>
                </div>

                {activeTab === "single" && (
                  <div className="mt-6">
                    <form onSubmit={handleSingleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="text-sm text-muted-foreground">Email address</label>
                        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
                      </div>
                      <Button type="submit" disabled={loading} className="w-full">{loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Validating...</>) : (<>Validate<Play className="h-4 w-4 ml-2" /></>)}</Button>
                    </form>
                    {result && (
                      <div className="mt-5 p-4 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge color={result.valid ? 'success' : 'danger'} variant="flat">{result.valid ? 'Valid' : 'Invalid'}</Badge>
                          <Badge variant="outline">{Math.round(result.confidence_score * 100)}% confidence</Badge>
                        </div>
                        <div className="text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{result.email}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Domain</span><span className="font-medium">{result.domain}</span></div></div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "batch" && (
                  <div className="mt-6">
                    <div className="space-y-3">
                      <label htmlFor="batch" className="text-sm text-muted-foreground">One email per line (max 100)</label>
                      <Textarea id="batch" rows={10} value={batchEmails} onChange={(e) => setBatchEmails(e.target.value)} placeholder={"user1@example.com\nuser2@example.com"} />
                      <div className="flex items-center gap-2">
                        <Button onClick={validateBatchEmails} disabled={loading}>Run Batch</Button>
                        <Button variant="outline" onClick={() => setBatchEmails('')}>Clear</Button>
                      </div>
                      {batchResult && (
                        <div className="p-4 rounded-lg border border-border/50 text-sm">
                          <div className="font-medium mb-2">Summary</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <Badge variant="outline">Total: {batchResult.summary.total}</Badge>
                            <Badge variant="outline">Valid: {batchResult.summary.valid}</Badge>
                            <Badge variant="outline">Invalid: {batchResult.summary.invalid}</Badge>
                            <Badge variant="outline">Disposable: {batchResult.summary.disposable}</Badge>
                            <Badge variant="outline">High risk: {batchResult.summary.high_risk}</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-card/50 border border-primary/20 rounded-xl">
              <div className="p-6 border-b border-primary/10">
                <Title as="h2" className="flex items-center gap-2"><History className="h-4 w-4" />Recent History</Title>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm">
                  {history.length === 0 && (<div className="text-muted-foreground">No history yet</div>)}
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 p-2 rounded border border-border/50">
                      <span className="truncate max-w-[200px]" title={h.email}>{h.email}</span>
                      <div className="flex items-center gap-1">
                        <Badge color={h.valid ? 'success' : 'danger'} variant="flat">{h.valid ? 'Valid' : 'Invalid'}</Badge>
                        <Button size="sm" variant="text" onClick={() => copyToClipboard(h.email)} aria-label="Copy email"><Copy className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
                {history.length > 0 && (<Button variant="text" size="sm" className="mt-2" onClick={clearHistory}>Clear history</Button>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
