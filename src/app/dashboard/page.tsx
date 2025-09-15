"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthButtons } from "@/components/auth-buttons";
import { 
  Calendar, Mail, User, Shield, Clock, Key, BarChart3, 
  Plus, Copy, Eye, EyeOff, Trash2, Loader2 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  isActive: boolean;
  monthlyQuota: number;
  currentUsage: number;
  createdAt: string;
  lastUsedAt?: string;
}

interface ApiStats {
  totalRequests: number;
  successfulRequests: number;
  errorRequests: number;
  averageResponseTime: number;
  topEndpoints?: { endpoint: string; count: number }[];
  dailyUsage: { date: string; count: number }[];
  endpointUsage?: { endpoint: string; requests: number }[];
}

export default function Dashboard() {
  const user = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyQuota, setNewKeyQuota] = useState(5000);
  const [showNewKey, setShowNewKey] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Auto-sync user on page load
  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user]);

  const syncUser = async () => {
    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
      });
      if (response.ok) {
        console.log('User synced successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to sync user:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch API keys and stats
      const [keysResponse, statsResponse] = await Promise.all([
        fetch('/api/dashboard/api-keys'),
        fetch('/api/dashboard/analytics')
      ]);
      
      if (keysResponse.ok) {
        const keysData = await keysResponse.json() as { apiKeys?: ApiKey[] };
        setApiKeys(keysData.apiKeys || []);
      }
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json() as { stats?: ApiStats };
        setApiStats(statsData.stats || null);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;
    
    try {
      setCreating(true);
      const response = await fetch('/api/dashboard/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newKeyName.trim(), 
          monthlyQuota: newKeyQuota 
        })
      });
      
      if (response.ok) {
        const data = await response.json() as { secretKey: string };
        setShowNewKey(data.secretKey);
        setNewKeyName("");
        setNewKeyQuota(5000);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/dashboard/api-keys/${keyId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">API Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your API dashboard
          </p>
          <AuthButtons />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">API Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your API keys and monitor usage analytics
            </p>
          </div>
          <AuthButtons />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info & Quick Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Account</p>
                      <p className="text-xs text-muted-foreground">{user.displayName || 'User'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Key className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">API Keys</p>
                      <p className="text-xs text-muted-foreground">{apiKeys.length} active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">This Month</p>
                      <p className="text-xs text-muted-foreground">
                        {apiStats?.totalRequests || 0} requests
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Avg Response</p>
                      <p className="text-xs text-muted-foreground">
                        {apiStats?.averageResponseTime || 0}ms
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Keys Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Manage your API keys for accessing the TruMailer API v2
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New API Key</DialogTitle>
                        <DialogDescription>
                          Create a new API key to access the TruMailer API v2
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="keyName">Key Name</Label>
                          <Input
                            id="keyName"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g. Production API Key"
                          />
                        </div>
                        <div>
                          <Label htmlFor="keyQuota">Monthly Quota</Label>
                          <Input
                            id="keyQuota"
                            type="number"
                            value={newKeyQuota}
                            onChange={(e) => setNewKeyQuota(parseInt(e.target.value) || 5000)}
                            min={1000}
                            max={100000}
                          />
                        </div>
                        <Button 
                          onClick={createApiKey} 
                          disabled={creating || !newKeyName.trim()}
                          className="w-full"
                        >
                          {creating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2" />
                          )}
                          Create API Key
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {showNewKey && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">
                      🎉 New API Key Created!
                    </p>
                    <p className="text-xs text-green-700 mb-2">
                      Please copy this key now. You won&apos;t be able to see it again.
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-3 py-2 rounded border text-xs">
                        {showNewKey}
                      </code>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(showNewKey)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowNewKey("")}
                      className="mt-2"
                    >
                      I&apos;ve saved this key
                    </Button>
                  </div>
                )}
                
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No API keys yet</p>
                    <p className="text-sm text-muted-foreground">
                      Create your first API key to start using the TruMailer API v2
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{key.name}</h4>
                            <Badge variant={key.isActive ? "default" : "secondary"}>
                              {key.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <code className="bg-muted px-2 py-1 rounded">
                              {visibleKeys.has(key.id) ? key.keyPreview : '•'.repeat(20)}
                            </code>
                            <span>{key.currentUsage}/{key.monthlyQuota} requests</span>
                            <span>Created {new Date(key.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {visibleKeys.has(key.id) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(key.keyPreview)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteApiKey(key.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics */}
            {apiStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Usage Analytics
                  </CardTitle>
                  <CardDescription>
                    Your API usage statistics for this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Requests</span>
                        <span className="text-2xl font-bold">{apiStats.totalRequests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Successful</span>
                        <span className="text-lg font-semibold text-green-600">{apiStats.successfulRequests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Failed</span>
                        <span className="text-lg font-semibold text-red-600">{apiStats.errorRequests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Response Time</span>
                        <span className="text-lg font-semibold">{apiStats.averageResponseTime}ms</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Top Endpoints</h4>
                      <div className="space-y-2">
                        {(apiStats.endpointUsage || apiStats.topEndpoints || []).slice(0, 5).map((endpoint, index) => {
                          // Handle both endpointUsage and topEndpoints formats
                          const count = 'count' in endpoint ? endpoint.count : 'requests' in endpoint ? endpoint.requests : 0;
                          return (
                            <div key={endpoint.endpoint} className="flex items-center justify-between">
                              <code className="text-xs bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          );
                        })}
                        {(!apiStats.endpointUsage && !apiStats.topEndpoints) && (
                          <p className="text-sm text-muted-foreground">No endpoint data available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}