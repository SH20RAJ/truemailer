"use client";

import { useState } from "react";
import { Button, Input } from "rizzui";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { Loader2, Copy, Check } from "lucide-react";

export function CreateKeyForm() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig();
    const [newKey, setNewKey] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await res.json() as any;
            if (!res.ok) throw new Error(data.error || "Failed to create key");

            setNewKey(data.secretKey);
            setShowSuccess(true);
            toast.success("API Key created successfully");
            mutate("/api/keys");
            setName("");
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (newKey) {
            navigator.clipboard.writeText(newKey);
            toast.success("Secret key copied to clipboard");
        }
    };

    if (showSuccess && newKey) {
        return (
            <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 transition-all animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            API Key Created Successfully
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Copy this key now. You won't be able to see it again!
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <div className="flex-1 sm:flex-initial bg-background border border-border rounded px-3 py-1.5 font-mono text-sm">
                            {newKey}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="shrink-0"
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="flat"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setShowSuccess(false);
                                setNewKey(null);
                            }}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                            Create New API Key
                        </label>
                        <Input
                            placeholder="e.g. Production Server"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background"
                            disabled={loading}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="w-full sm:w-auto min-w-[120px]"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            "Create Key"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
