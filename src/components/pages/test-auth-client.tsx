"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthButtons } from "@/components/auth-buttons";
import { Loader2 } from "lucide-react";
import type { User as DbUser } from "@/lib/db/schema";
import Image from "next/image";

type ApiResponse = { success?: boolean; user?: DbUser; error?: string };

export default function TestAuthClient() {
  const user = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const syncUser = async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/sync-user", { method: "POST" });
      const data = await response.json() as ApiResponse;
      if (response.ok && data.user) setDbUser(data.user);
      else setError(data.error || "Failed to sync user");
    } catch { setError("Network error"); } finally { setLoading(false); }
  };

  const fetchDbUser = async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/sync-user");
      const data = await response.json() as ApiResponse;
      if (response.ok && data.user) setDbUser(data.user);
      else setError(data.error || "Failed to fetch user");
    } catch { setError("Network error"); } finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (user) fetchDbUser(); }, [user]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Authentication Test</h1>
          <p className="text-muted-foreground mb-6">Test StackAuth integration with D1 database user storage</p>
          <AuthButtons />
        </div>

        {user && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>StackAuth User</CardTitle>
                <CardDescription>User data from StackAuth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.primaryEmail}</div>
                <div><strong>Display Name:</strong> {user.displayName || "Not set"}</div>
                <div><strong>Email Verified:</strong> {user.primaryEmailVerified ? "Yes" : "No"}</div>
                {user.profileImageUrl && (
                  <div className="flex items-center gap-2">
                    <strong>Profile Image:</strong>
                    <Image src={user.profileImageUrl} alt="Profile" width={32} height={32} className="rounded-full" unoptimized />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database User</CardTitle>
                <CardDescription>User data stored in D1 database</CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (<div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>)}
                {error && (<div className="text-red-500">Error: {error}</div>)}
                {dbUser && !loading && (
                  <div className="space-y-2">
                    <div><strong>ID:</strong> {dbUser.id}</div>
                    <div><strong>Email:</strong> {dbUser.email}</div>
                    <div><strong>Display Name:</strong> {dbUser.displayName || "Not set"}</div>
                    <div><strong>Created:</strong> {new Date(dbUser.createdAt).toLocaleString()}</div>
                    <div><strong>Updated:</strong> {new Date(dbUser.updatedAt).toLocaleString()}</div>
                  </div>
                )}
                {!dbUser && !loading && !error && (<div className="text-muted-foreground">No database record found</div>)}
                <div className="mt-4 space-y-2">
                  <Button onClick={syncUser} disabled={loading} className="w-full">
                    {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>) : ("Sync to Database")}
                  </Button>
                  <Button onClick={fetchDbUser} disabled={loading} variant="outline" className="w-full">Refresh Database Data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!user && (
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">Please sign in to test the authentication integration</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
