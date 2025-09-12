"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function HelpImprovePage() {
    const [email, setEmail] = useState("");
    const [domain, setDomain] = useState("");
    const [reason, setReason] = useState("");
    const [submissionType, setSubmissionType] = useState<"spam" | "allow">("spam");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        setEmail("");
        setDomain("");
        setReason("");
    };

    const mockSuggestions = [
        {
            id: 1,
            email: "spam@temp-mail.org",
            type: "spam",
            reason: "Temporary email provider used for spam",
            votes: 15,
            status: "approved",
            submittedBy: "user123",
            submittedAt: "2024-01-15"
        },
        {
            id: 2,
            domain: "legitimate-business.com",
            type: "allow",
            reason: "Verified business domain with proper MX records",
            votes: 8,
            status: "pending",
            submittedBy: "dev_user",
            submittedAt: "2024-01-14"
        },
        {
            id: 3,
            email: "noreply@scam-site.net",
            type: "spam",
            reason: "Known phishing domain",
            votes: 23,
            status: "approved",
            submittedBy: "security_expert",
            submittedAt: "2024-01-13"
        },
        {
            id: 4,
            domain: "university-email.edu",
            type: "allow",
            reason: "Educational institution domain",
            votes: 12,
            status: "approved",
            submittedBy: "admin_user",
            submittedAt: "2024-01-12"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
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
                            <h1 className="text-2xl font-bold">Help Improve Email Validation</h1>
                            <p className="text-muted-foreground">
                                Contribute to our community-driven spam detection system
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Success Popup */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50"
                    >
                        <Card className="bg-primary/10 border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">Submission Received!</p>
                                        <p className="text-sm text-muted-foreground">
                                            Your suggestion will be reviewed by our team within 24 hours.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Submission Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Submit Email/Domain Suggestion
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Help us improve our validation accuracy by reporting spam domains or suggesting legitimate ones.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={submissionType} onValueChange={(value) => setSubmissionType(value as "spam" | "allow")}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="spam" className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" />
                                            Report Spam
                                        </TabsTrigger>
                                        <TabsTrigger value="allow" className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Suggest Allow
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="spam" className="mt-6">
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Email Address (optional)
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        placeholder="spam@example.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Domain (optional)
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        placeholder="spam-domain.com"
                                                        value={domain}
                                                        onChange={(e) => setDomain(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Reason for reporting as spam *
                                                </label>
                                                <Textarea
                                                    placeholder="Describe why this email/domain should be flagged as spam..."
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    required
                                                    rows={3}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full">
                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                Report as Spam
                                            </Button>
                                        </form>
                                    </TabsContent>

                                    <TabsContent value="allow" className="mt-6">
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Email Address (optional)
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        placeholder="legitimate@company.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Domain (optional)
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        placeholder="legitimate-company.com"
                                                        value={domain}
                                                        onChange={(e) => setDomain(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Reason for allowlisting *
                                                </label>
                                                <Textarea
                                                    placeholder="Explain why this email/domain is legitimate and should be allowed..."
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    required
                                                    rows={3}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Suggest for Allowlist
                                            </Button>
                                        </form>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Community Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Submissions</span>
                                    <span className="font-semibold">1,247</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Approved This Week</span>
                                    <span className="font-semibold text-primary">89</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Pending Review</span>
                                    <span className="font-semibold text-orange-500">23</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Active Contributors</span>
                                    <span className="font-semibold">156</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">How It Works</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-primary">1</span>
                                    </div>
                                    <p>Submit email addresses or domains with detailed reasoning</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-primary">2</span>
                                    </div>
                                    <p>Community members vote on submissions</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-primary">3</span>
                                    </div>
                                    <p>Our team reviews and approves valid submissions</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-primary">4</span>
                                    </div>
                                    <p>Updates are deployed to the API within 24 hours</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Community Submissions</CardTitle>
                            <p className="text-muted-foreground">
                                See what the community has been reporting and vote on submissions
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge
                                                    variant={suggestion.type === "spam" ? "destructive" : "default"}
                                                    className="text-xs"
                                                >
                                                    {suggestion.type === "spam" ? "Spam Report" : "Allow Request"}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        suggestion.status === "approved"
                                                            ? "default"
                                                            : suggestion.status === "pending"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {suggestion.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                                                    {suggestion.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                                    {suggestion.status}
                                                </Badge>
                                            </div>
                                            <p className="font-medium">
                                                {suggestion.email || suggestion.domain}
                                            </p>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {suggestion.reason}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Submitted by {suggestion.submittedBy} on {suggestion.submittedAt}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="flex items-center gap-1 text-sm">
                                                <span className="font-medium">{suggestion.votes}</span>
                                                <span className="text-muted-foreground">votes</span>
                                            </div>
                                            {isLoggedIn ? (
                                                <div className="flex gap-1">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                        <ThumbsUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                        <ThumbsDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setIsLoggedIn(true)}
                                                >
                                                    Sign in to vote
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}