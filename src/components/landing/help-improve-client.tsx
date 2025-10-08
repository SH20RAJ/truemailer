"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Users } from "lucide-react";
import Link from "next/link";

export function HelpImproveClient() {
    const [email, setEmail] = useState("");
    const [domain, setDomain] = useState("");
    const [reason, setReason] = useState("");
    const [submissionType, setSubmissionType] = useState<"spam" | "allow">("spam");
    const [showSuccess, setShowSuccess] = useState(false);


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
                                                        placeholder="legitimate@example.com"
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
                                                        placeholder="legitimate-domain.com"
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
                                                    placeholder="Describe why this email/domain should be allowed..."
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    required
                                                    rows={3}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Suggest Allow
                                            </Button>
                                        </form>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats and Recent Submissions */}
                    <div className="space-y-6">
                        {/* Community Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Community Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Total Submissions</span>
                                        <Badge variant="secondary">1,247</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Approved</span>
                                        <Badge variant="default">892</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Under Review</span>
                                        <Badge variant="outline">143</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Contributors</span>
                                        <Badge variant="secondary">89</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Submissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {mockSuggestions.slice(0, 3).map((suggestion) => (
                                        <div key={suggestion.id} className="pb-3 border-b last:border-b-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {suggestion.type === "spam" ? (
                                                            <AlertTriangle className="h-3 w-3 text-red-500" />
                                                        ) : (
                                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                                        )}
                                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                                            {suggestion.email || suggestion.domain}
                                                        </code>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {suggestion.reason}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <ThumbsUp className="h-3 w-3" />
                                                            <span className="text-xs">{suggestion.votes}</span>
                                                        </div>
                                                        <Badge
                                                            variant={suggestion.status === "approved" ? "default" : 
                                                                    suggestion.status === "pending" ? "outline" : "secondary"}
                                                            className="text-xs"
                                                        >
                                                            {suggestion.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Submission Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <p>Provide clear reasoning for your submission</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <p>Include specific examples when possible</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <p>Only submit legitimate spam reports</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <p>All submissions are reviewed by moderators</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Full Submissions List */}
                <div className="mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Community Submissions</CardTitle>
                            <p className="text-muted-foreground">
                                Vote on community submissions to help improve our spam detection
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockSuggestions.map((suggestion) => (
                                    <div key={suggestion.id} className="p-4 border rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {suggestion.type === "spam" ? (
                                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    )}
                                                    <code className="bg-muted px-2 py-1 rounded text-sm">
                                                        {suggestion.email || suggestion.domain}
                                                    </code>
                                                    <Badge
                                                        variant={suggestion.status === "approved" ? "default" : 
                                                                suggestion.status === "pending" ? "outline" : "secondary"}
                                                    >
                                                        {suggestion.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {suggestion.reason}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>By {suggestion.submittedBy}</span>
                                                    <span>{suggestion.submittedAt}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!isLoggedIn ? (
                                                    <p className="text-xs text-muted-foreground">Login to vote</p>
                                                ) : (
                                                    <>
                                                        <Button size="sm" variant="outline">
                                                            <ThumbsUp className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <ThumbsDown className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                <div className="flex items-center gap-1 ml-2">
                                                    <ThumbsUp className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm font-medium">{suggestion.votes}</span>
                                                </div>
                                            </div>
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
