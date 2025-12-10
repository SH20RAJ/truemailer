"use client";

import { UserButton, useUser } from "@stackframe/stack";
import { Loader2, CreditCard, Key, User } from "lucide-react";
import { Button, Input } from "rizzui";

export default function SettingsPage() {
    const user = useUser();

    if (!user) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <div className="space-y-4 border border-border rounded-lg p-6 bg-card">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <User className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">General</h2>
                    </div>

                    <div className="grid gap-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email</label>
                            <Input
                                value={user.primaryEmail || ""}
                                disabled
                                className="bg-muted/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">User ID</label>
                            <Input
                                value={user.id}
                                disabled
                                className="bg-muted/50 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Profile Management:</span>
                            <UserButton />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Manage your password and other profile details via the Stack account modal.
                        </p>
                    </div>
                </div>

                {/* API Usage Section */}
                <div className="space-y-4 border border-border rounded-lg p-6 bg-card">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Key className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">API Usage</h2>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                        <div>
                            <p className="font-medium">Monthly Quota</p>
                            <p className="text-sm text-muted-foreground">Free Tier</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">0 / 5000</p>
                            <p className="text-xs text-muted-foreground">Requests used this month</p>
                        </div>
                    </div>
                </div>

                {/* Billing Section */}
                <div className="space-y-4 border border-border rounded-lg p-6 bg-card">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Billing</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            You are currently on the <strong>Free Plan</strong>. Upgrade to unlock higher limits and premium features.
                        </p>
                        <Button variant="outline">Manage Subscription</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
