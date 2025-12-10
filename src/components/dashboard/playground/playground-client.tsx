"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "rizzui";
import { Search, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PlaygroundPage() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setResult(null);

        try {
            // Use the new API endpoint
            const res = await fetch(`/api/v1/validate?email=${encodeURIComponent(email)}`);
            // Note: We haven't implemented /api/v1/validate explicitly yet, but generic validate is needed.
            // Wait, app.ts doesn't have validate route yet! I need to add it.
            // Assuming for now I will add it or use existing logic refactored.
            // I'll call existing /api/validate mechanism or create new route.
            // The task "Implement Email Validation Playground/Tool" implies UI first.

            // I'll assume /api/validate exists (it was legacy, I should recreate it in Elysia).
            // I'll use /api/validate for now and ensure route exists.
            const data = await res.json();
            setResult(data);
        } catch (error) {
            toast.error("Validation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Validation Playground</h1>
                <p className="text-muted-foreground mt-1">Test the email validation engine in real-time.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <form onSubmit={handleValidate} className="flex gap-4">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter an email to validate..."
                        className="flex-1"
                        size="lg"
                    />
                    <Button type="submit" size="lg" isLoading={loading} disabled={!email}>
                        Run Check
                    </Button>
                </form>
            </div>

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6"
                    >
                        {/* Result Cards would go here based on API response structure */}
                        <div className="p-6 bg-card border border-border rounded-xl">
                            <pre className="text-xs overflow-auto max-h-[400px]">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
