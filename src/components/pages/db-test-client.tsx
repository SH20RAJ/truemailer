"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect } from "react";
import { Button, Badge, Title, Text } from "rizzui";
import { CheckCircle, XCircle, Database, Users, Loader2 } from "lucide-react";
import type { User } from "@/lib/db/schema";
import Image from "next/image";

interface DbStats {
  totalUsers: number;
  totalTodos: number;
  latestUser?: User;
}

export default function DatabaseTestClient() {
  const user = useUser();
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDbStats = async () => {
    try {
      setLoading(true);
      setError("");
      const [usersResponse, todosResponse] = await Promise.all([
        fetch('/api/auth/sync-user'),
        fetch('/api/todo'),
      ]);
      const usersData = await usersResponse.json() as { user?: User; error?: string };
      const todosData = await todosResponse.json() as { todos?: unknown[]; error?: string };
      setDbStats({ totalUsers: usersData.user ? 1 : 0, totalTodos: todosData.todos?.length || 0, latestUser: usersData.user });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch database stats');
    } finally { setLoading(false); }
  };

  const handleMigrateApiTables = async () => {
    try {
      const response = await fetch('/api/migrate-api-tables', { method: 'POST' });
      const result = await response.json() as { message: string; error?: string };
      alert(response.ok ? ('Migration successful: ' + result.message) : 'Migration failed');
    } catch (error) { alert('Migration error: ' + error); }
  };

  useEffect(() => { fetchDbStats(); }, [user]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Title as="h1" className="text-3xl font-bold mb-4">Database Connection Test</Title>
          <Text className="text-muted-foreground">Testing Turso database connection and user sync functionality</Text>
        </div>

        <div className="bg-card/50 border border-primary/20 rounded-xl mb-6">
          <div className="p-6 border-b border-primary/10">
            <Title as="h2" className="flex items-center gap-2"><Database className="w-5 h-5" />Database Status</Title>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Checking database connection...</div>
            ) : error ? (
              <div className="flex items-center gap-2 text-red-600"><XCircle className="w-5 h-5" /><Badge color="danger" variant="flat">Error</Badge><Text className="text-sm">{error}</Text></div>
            ) : (
              <div className="flex items-center gap-2 text-green-600"><CheckCircle className="w-5 h-5" /><Badge color="success" variant="flat">Connected</Badge><Text className="text-sm">Turso database is operational</Text></div>
            )}
          </div>
        </div>

        {dbStats && (
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="bg-card/50 border border-primary/20 rounded-xl">
              <div className="p-6 border-b border-primary/10">
                <Title as="h2" className="flex items-center gap-2"><Users className="w-5 h-5" />User Statistics</Title>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Current User in DB:</span><Badge color={dbStats.latestUser ? "success" : "secondary"} variant="flat">{dbStats.latestUser ? "Synced" : "Not Synced"}</Badge></div>
                  {dbStats.latestUser && (
                    <div className="text-sm text-muted-foreground"><p>ID: {dbStats.latestUser.id}</p><p>Email: {dbStats.latestUser.email}</p><p>Name: {dbStats.latestUser.displayName || "Not set"}</p></div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-card/50 border border-primary/20 rounded-xl">
              <div className="p-6 border-b border-primary/10">
                <Title as="h2" className="flex items-center gap-2"><Database className="w-5 h-5" />Todos Statistics</Title>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Total Todos:</span><Badge variant="outline">{dbStats.totalTodos}</Badge></div>
                  <div className="text-sm text-muted-foreground">Visit <code>/todo</code> to test CRUD operations</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {user ? (
          <div className="bg-card/50 border border-primary/20 rounded-xl mb-6">
            <div className="p-6 border-b border-primary/10">
              <Title as="h2">Current User</Title>
              <Text className="text-sm text-muted-foreground">StackAuth user information and sync status</Text>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {user.profileImageUrl && (
                    <Image src={user.profileImageUrl} alt="Profile" width={48} height={48} className="rounded-full border" unoptimized />
                  )}
                  <div><h3 className="font-semibold">{user.displayName || "No name set"}</h3><p className="text-sm text-muted-foreground">{user.primaryEmail}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">User ID:</span><p className="text-muted-foreground font-mono text-xs">{user.id}</p></div>
                  <div><span className="font-medium">Email Verified:</span><p className="text-muted-foreground">{user.primaryEmailVerified ? "Yes" : "No"}</p></div>
                </div>
                {dbStats?.latestUser && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800"><CheckCircle className="w-4 h-4" /><span className="font-medium">Auto-sync successful!</span></div>
                    <p className="text-sm text-green-700 mt-1">User data has been automatically synced to Turso database</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card/50 border border-primary/20 rounded-xl mb-6">
            <div className="p-6 border-b border-primary/10">
              <Title as="h2">Authentication Required</Title>
              <Text className="text-sm text-muted-foreground">Please sign in to test database sync functionality</Text>
            </div>
            <div className="p-6">
              <Text className="text-muted-foreground">Sign in to see automatic user sync in action</Text>
            </div>
          </div>
        )}

        <div className="bg-card/50 border border-primary/20 rounded-xl">
          <div className="p-6 border-b border-primary/10">
            <Title as="h2">Manual Actions</Title>
          </div>
          <div className="p-6">
            <div className="flex gap-2">
              <Button onClick={fetchDbStats} disabled={loading} variant="outline" className="flex items-center gap-2">{loading ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<Database className="w-4 h-4" />)}Refresh Stats</Button>
              <Button onClick={handleMigrateApiTables} color="secondary" className="flex items-center gap-2"><Database className="w-4 h-4" />Migrate API Tables</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
