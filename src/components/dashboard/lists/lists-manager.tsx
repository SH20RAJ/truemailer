"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button, Input, Select, Table, Text } from "rizzui";
import { Trash2, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { PersonalBlocklist, PersonalWhitelist } from "@/lib/db/schema";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ListType = "blocklist" | "whitelist";

export function ListsManager() {
    const [activeTab, setActiveTab] = useState<ListType>("blocklist");

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 border-b border-border pb-1">
                <button
                    onClick={() => setActiveTab("blocklist")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "blocklist"
                        ? "border-red-500 text-red-500"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Blocklist
                </button>
                <button
                    onClick={() => setActiveTab("whitelist")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "whitelist"
                        ? "border-green-500 text-green-500"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Allowlist
                </button>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            {activeTab === "blocklist" ? <AlertCircle className="h-5 w-5 text-red-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                            {activeTab === "blocklist" ? "Personal Blocklist" : "Personal Allowlist"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {activeTab === "blocklist"
                                ? "Emails and domains here will always be marked as INVALID."
                                : "Emails and domains here will always be marked as VALID, skipping other checks."}
                        </p>
                    </div>
                </div>

                <AddEntryForm type={activeTab} />
                <div className="mt-8">
                    <ListTable type={activeTab} />
                </div>
            </div>
        </div>
    );
}

function AddEntryForm({ type }: { type: ListType }) {
    const [value, setValue] = useState("");
    const [entryType, setEntryType] = useState<"email" | "domain">("email");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/lists/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrDomain: value, type: entryType, reason }),
            });

            if (!res.ok) {
                const data = await res.json() as any;
                throw new Error(data.error || "Failed to add entry");
            }

            toast.success("Entry added successfully");
            setValue("");
            setReason("");
            mutate(`/api/lists/${type}`);
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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end bg-muted/30 p-4 rounded-lg border border-border/50">
            <div className="w-full md:w-auto md:flex-1">
                <label className="block text-xs font-medium mb-1">Email or Domain</label>
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={entryType === "email" ? "user@example.com" : "example.com"}
                    required
                />
            </div>
            <div className="w-full md:w-32">
                <label className="block text-xs font-medium mb-1">Type</label>
                <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value as "email" | "domain")}
                >
                    <option value="email">Email</option>
                    <option value="domain">Domain</option>
                </select>
            </div>
            <div className="w-full md:w-auto md:flex-1">
                <label className="block text-xs font-medium mb-1">Note (Optional)</label>
                <Input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Competitor domain"
                />
            </div>
            <Button type="submit" isLoading={loading} className="w-full md:w-auto shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
            </Button>
        </form>
    );
}

import { useSWRConfig } from "swr";

function ListTable({ type }: { type: ListType }) {
    const { data, isLoading } = useSWR<any[]>(`/api/lists/${type}`, (url: string) => fetch(url).then((res) => res.json() as Promise<any[]>));
    const { mutate } = useSWRConfig();

    const handleDelete = async (id: number) => {
        if (!confirm("Remove this entry?")) return;
        try {
            await fetch(`/api/lists/${type}/${id}`, { method: "DELETE" });
            toast.success("Entry removed");
            mutate(`/api/lists/${type}`);
        } catch (e) {
            toast.error("Failed to remove entry");
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading list...</div>;
    if (!data || data.length === 0) return <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">No entries found in this list.</div>;

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                        <th className="px-4 py-3">Value</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Note</th>
                        <th className="px-4 py-3">Added</th>
                        <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((item) => (
                        <tr key={item.id} className="bg-background hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 font-medium">{item.emailOrDomain}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.type === 'domain' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {item.type}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground italic">{item.reason || "-"}</td>
                            <td className="px-4 py-3 text-muted-foreground">{format(new Date(item.createdAt), "MMM d, yyyy")}</td>
                            <td className="px-4 py-3 text-right">
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
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
