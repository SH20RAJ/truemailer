"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function SuggestEmails() {
    const [email, setEmail] = useState("");
    const [reason, setReason] = useState("");
    const [type, setType] = useState<"spam" | "allow">("spam");
    const [showPopup, setShowPopup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

    // Mock data for suggested emails
    const suggestions = [
        {
            id: 1,
            email: "spam@example.com",
            type: "spam",
            reason: "Known spam domain",
            upvotes: 15,
            downvotes: 2,
            status: "pending"
        },
        {
            id: 2,
            domain: "temp-mail.org",
            type: "spam",
            reason: "Temporary email provider",
            upvotes: 23,
            downvotes: 1,
            status: "approved"
        },
        {
            id: 3,
            domain: "company.com",
            type: "allow",
            reason: "Legitimate business domain",
            upvotes: 8,
            downvotes: 0,
            status: "pending"
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setShowPopup(true);
        setEmail("");
        setReason("");
    };

    const handleVote = (id: number, voteType: "up" | "down") => {
        if (!isLoggedIn) {
            alert("Please log in to vote");
            return;
        }
        // Handle voting logic here
        console.log(`Voted ${voteType} on suggestion ${id}`);
    };

    return (
        <section id="suggest-emails" className="py-20 bg-muted/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Help Improve Email Validation
                    </motion.h2>
                    <motion.p
                        className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Suggest spammy domains or emails that should be blocked, or legitimate domains that should be allowed.
                        Community votes help us maintain accurate lists.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link href="/help-improve">
                            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Full Submission Page
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Suggestion Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="bg-card/50 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-2xl">Suggest Email/Domain</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={type === "spam" ? "default" : "outline"}
                                            onClick={() => setType("spam")}
                                            className={type === "spam" ? "bg-destructive hover:bg-destructive/90" : "border-destructive/50 text-destructive hover:bg-destructive/10"}
                                        >
                                            Report Spam
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={type === "allow" ? "default" : "outline"}
                                            onClick={() => setType("allow")}
                                            className={type === "allow" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}
                                        >
                                            Suggest Allow
                                        </Button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Email or Domain
                                        </label>
                                        <Input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="spam@example.com or example.com"
                                            className="bg-input border-border"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Reason (Optional)
                                        </label>
                                        <Textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Why should this be added to the list?"
                                            className="bg-input border-border"
                                            rows={3}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                        Submit Suggestion
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Community Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="bg-card/50 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-2xl">Community Suggestions</CardTitle>
                                <p className="text-muted-foreground">
                                    {isLoggedIn ? "Vote on suggestions to help improve our lists" : "Log in to vote on suggestions"}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {suggestions.map((suggestion) => (
                                        <div key={suggestion.id} className="p-4 border border-border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <code className="bg-muted px-2 py-1 rounded text-sm">
                                                            {suggestion.email || suggestion.domain}
                                                        </code>
                                                        <Badge
                                                            variant={suggestion.type === "spam" ? "destructive" : "default"}
                                                            className={suggestion.type === "spam" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}
                                                        >
                                                            {suggestion.type === "spam" ? "Spam" : "Allow"}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                suggestion.status === "approved"
                                                                    ? "border-primary/50 text-primary"
                                                                    : "border-muted-foreground/50 text-muted-foreground"
                                                            }
                                                        >
                                                            {suggestion.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleVote(suggestion.id, "up")}
                                                        className="border-primary/50 text-primary hover:bg-primary/10 h-8 px-2"
                                                        disabled={!isLoggedIn}
                                                    >
                                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                        {suggestion.upvotes}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleVote(suggestion.id, "down")}
                                                        className="border-destructive/50 text-destructive hover:bg-destructive/10 h-8 px-2"
                                                        disabled={!isLoggedIn}
                                                    >
                                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                        {suggestion.downvotes}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!isLoggedIn && (
                                    <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                                        <p className="text-muted-foreground mb-2">Want to vote on suggestions?</p>
                                        <Button
                                            variant="outline"
                                            className="border-primary/50 text-primary hover:bg-primary/10"
                                            onClick={() => setIsLoggedIn(true)}
                                        >
                                            Sign In
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Success Popup */}
                <Dialog open={showPopup} onOpenChange={setShowPopup}>
                    <DialogContent className="bg-card border-primary/20">
                        <DialogHeader>
                            <DialogTitle className="text-primary">Suggestion Submitted!</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Thank you for your suggestion. We will review the {type === "spam" ? "domain/email" : "domain"} and
                                {type === "spam" ? " add it to our spam list" : " consider it for our allow list"} if it meets our criteria.
                                <br /><br />
                                Our team manually verifies all suggestions before adding them to ensure accuracy.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end">
                            <Button onClick={() => setShowPopup(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Got it
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}