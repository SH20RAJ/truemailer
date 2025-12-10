"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button, Table } from "rizzui";
import { Trash2, Copy, Check, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ApiKey } from "@/lib/db/schema";

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<ApiKey[]>);

export function KeysTable() {
    const { data: keys, error, mutate, isLoading } = useSWR<ApiKey[]>("/api/keys", fetcher);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete key");
            toast.success("API Key revoked successfully");
            mutate();
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An error occurred");
            }
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading) return <div>Loading keys...</div>;
    if (error) return <div className="text-red-500">Failed to load API keys</div>;
    if (!keys || keys.length === 0) return <div className="text-muted-foreground">No API keys found. Create one to get started.</div>;

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Key Hash (Prefix)</th>
                        <th className="px-4 py-3">Monthly Quota</th>
                        <th className="px-4 py-3">Usage</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {keys.map((key) => (
                        <tr key={key.id} className="bg-background hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 font-medium">{key.name}</td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                {key.keyHash.substring(0, 10)}...
                            </td>
                            <td className="px-4 py-3">{key.monthlyQuota}</td>
                            <td className="px-4 py-3">
                                <span className={key.currentUsage! > key.monthlyQuota! ? "text-red-500" : ""}>
                                    {key.currentUsage}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{format(new Date(key.createdAt), "MMM d, yyyy")}</td>
                            <td className="px-4 py-3 text-right space-x-2">
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => copyToClipboard(key.keyHash, key.id)}>
                                    {copiedId === key.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(key.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
