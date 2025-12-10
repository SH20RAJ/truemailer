"use client";

import { useState } from "react";
import { Button, Input, Select } from "rizzui";
import { Loader2, Play, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import useSWR from "swr";
import { ApiKey } from "@/lib/db/schema";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<ApiKey[]>);

export function ApiPlayground() {
    const { data: keys, isLoading: keysLoading } = useSWR<ApiKey[]>("/api/keys", fetcher);
    const [selectedKey, setSelectedKey] = useState<string>("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Auto-select first key when loaded
    if (keys && keys.length > 0 && !selectedKey) {
        // We can't access the full secret key here (it's hashed), so we ask the user to input it
        // OR if this is a playground for *testing* the API logic, we might need a way to proxy calls?
        // Wait, the user has the key from the "Creation" step. 
        // But for a playground, usually you paste your key.
        // HOWEVER, the user request says: "add place where people can use there api key and test it"
        // So a text input for the key is best.
    }

    const handleTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !selectedKey) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch(`/api/v1/validate?email=${encodeURIComponent(email)}`, {
                headers: {
                    "Authorization": `Bearer ${selectedKey}`
                }
            });
            const data = await res.json();
            setResult({ status: res.status, data });
        } catch (err) {
            toast.error("Failed to execute request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-border rounded-lg p-6 bg-card space-y-6">
            <div className="flex items-center gap-2 border-b border-border/50 pb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Play className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">API Playground</h2>
                    <p className="text-sm text-muted-foreground">Test your API keys instantly.</p>
                </div>
            </div>

            <form onSubmit={handleTest} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
                <div>
                    <label className="block text-sm font-medium mb-1.5">API Key</label>
                    <Input
                        type="text"
                        placeholder="Paste your secret key (tm_...)"
                        value={selectedKey}
                        onChange={(e) => setSelectedKey(e.target.value)}
                        className="w-full bg-background/50"
                        autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Use the key you just created.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">Test Email</label>
                    <Input
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background/50"
                        type="email"
                    />
                </div>

                <Button type="submit" disabled={loading || !email || !selectedKey} className="min-w-[100px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Validate"}
                </Button>
            </form>

            {result && (
                <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm border border-border animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                        {result.status === 200 ? (
                            <span className="flex items-center gap-2 text-green-500 font-bold">
                                <CheckCircle2 className="w-4 h-4" /> 200 OK
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-red-500 font-bold">
                                <XCircle className="w-4 h-4" /> {result.status} Error
                            </span>
                        )}
                    </div>
                    <pre className="overflow-x-auto text-xs sm:text-sm">
                        {JSON.stringify(result.data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
