"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthButtons } from "@/components/auth-buttons";
import { 
  Calendar, Mail, User, Shield, Clock, Key, BarChart3, 
  Plus, Copy, Eye, EyeOff, Trash2, Loader2, Code, BookOpen, Play, ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalListsClient } from "./personal-lists-client";

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

interface PlaygroundResult {
  email: string;
  domain?: string;
  valid: boolean;
  syntax_valid: boolean;
  disposable: boolean | null;
  role_based: boolean | null;
  mx_records: boolean | null;
  spammy?: boolean;
  allowed_list?: boolean;
  confidence_score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  suggestions?: string[];
  personal_override?: boolean;
  reason: string;
  timestamp?: string;
  cache_info?: {
    disposable_domains_count: number;
    allowed_domains_count: number;
    last_updated: string;
  };
}

type Section = "overview" | "playground" | "personal-lists" | "docs";

export function DashboardClient({ section }: { section?: Section } = {}) {
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
  
  // Playground state
  const [playgroundEmail, setPlaygroundEmail] = useState("xepeg24004@merumart.com");
  const [playgroundApiKey, setPlaygroundApiKey] = useState("");
  const [playgroundResult, setPlaygroundResult] = useState<PlaygroundResult | null>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Section>(section ?? "overview");

  // Derive active section from prop or query (fallback)
  useEffect(() => {
    if (section) {
      setActiveTab(section);
      return;
    }
    const q = (searchParams?.get("tab") as Section | null) || "overview";
    setActiveTab(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, searchParams]);

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

  const testPlaygroundApi = async () => {
    if (!playgroundApiKey || !playgroundEmail) {
      alert('Please provide both API key and email');
      return;
    }

    try {
      setPlaygroundLoading(true);
      const response = await fetch('/api/v2/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': playgroundApiKey
        },
        body: JSON.stringify({ email: playgroundEmail })
      });

      const result = await response.json() as PlaygroundResult;
      setPlaygroundResult(result);
    } catch (error) {
      console.error('API test failed:', error);
      setPlaygroundResult({
        email: playgroundEmail,
        valid: false,
        syntax_valid: false,
        disposable: null,
        role_based: null,
        mx_records: null,
        reason: 'API request failed'
      });
    } finally {
      setPlaygroundLoading(false);
    }
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

  // Page header details per section
  const header = {
    overview: { title: "Overview", desc: "Usage analytics and API keys at a glance.", icon: Key },
    playground: { title: "Playground", desc: "Test email validation with your API key.", icon: Code },
    "personal-lists": { title: "Personal Lists", desc: "Manage your blocklist and whitelist.", icon: ShieldCheck },
    docs: { title: "Documentation", desc: "Integrate the TruMailer API v2 in minutes.", icon: BookOpen },
  }[activeTab];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 text-primary p-2">
              <header.icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight leading-tight">{header.title}</h1>
              <p className="text-sm text-muted-foreground">{header.desc}</p>
            </div>
          </div>
          <AuthButtons />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(val: Section) => {
              setActiveTab(val);
              // If on dedicated section page, navigate to the route;
              // otherwise, keep query param for backward compatibility.
              if (pathname?.startsWith("/dashboard/")) {
                router.replace(`/dashboard/${val}`, { scroll: false });
              } else {
                const params = new URLSearchParams(searchParams ?? undefined);
                params.set("tab", val);
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
              }
            }}
            className="space-y-6"
          >
            {!section && (
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="playground">Playground</TabsTrigger>
                <TabsTrigger value="personal-lists">Personal Lists</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>
            )}

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
            {/* Quick Metrics - minimal row */}
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <div className="p-4 flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Account</div>
                    <div className="text-sm font-medium">{user.displayName || 'User'}</div>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-3 border-t md:border-t-0 md:border-l border-border/50">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">API Keys</div>
                    <div className="text-sm font-medium">{apiKeys.length} active</div>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-3 border-t md:border-l border-border/50">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                    <div className="text-sm font-medium">{apiStats?.totalRequests || 0} req</div>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-3 border-t md:border-l border-border/50">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                    <div className="text-sm font-medium">{apiStats?.averageResponseTime || 0}ms</div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Keys - minimal */}
            <section aria-labelledby="keys" className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 id="keys" className="text-base font-semibold">API Keys</h3>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-full px-4">
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

              {showNewKey && (
                <div className="rounded-lg border border-border/50 p-3 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-2">
                    New API key created. Copy and store it securely.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background px-3 py-2 rounded border border-border/50 text-xs overflow-x-auto">
                      {showNewKey}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(showNewKey)} className="rounded-full px-3">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setShowNewKey("")} className="mt-2 text-muted-foreground">
                    Dismiss
                  </Button>
                </div>
              )}

              {apiKeys.length === 0 ? (
                <div className="rounded-xl border border-border/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No API keys yet</p>
                  <p className="text-xs text-muted-foreground">Create your first API key to start.</p>
                </div>
              ) : (
                <ul className="rounded-xl border border-border/50 overflow-hidden">
                  {apiKeys.map((key) => (
                    <li key={key.id} className="p-4 border-b last:border-b-0 border-border/50 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate max-w-[220px]">{key.name}</h4>
                          <Badge variant={key.isActive ? "default" : "secondary"}>
                            {key.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <code className="bg-muted/50 px-2 py-1 rounded">
                            {visibleKeys.has(key.id) ? key.keyPreview : '•'.repeat(32)}
                          </code>
                          <span>{key.currentUsage}/{key.monthlyQuota} requests</span>
                          <span>Created {new Date(key.createdAt).toLocaleDateString()}</span>
                          {!visibleKeys.has(key.id) && (
                            <span className="text-[11px] text-muted-foreground/80">Hidden for security</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => toggleKeyVisibility(key.id)}
                          aria-label={visibleKeys.has(key.id) ? 'Hide key' : 'Show key'}
                        >
                          {visibleKeys.has(key.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(key.keyPreview)}
                          aria-label="Copy key"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-500"
                          onClick={() => deleteApiKey(key.id)}
                          aria-label="Delete key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Analytics - minimal */}
            {apiStats && (
              <section aria-labelledby="analytics" className="space-y-3">
                <h3 id="analytics" className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  Usage Analytics
                </h3>
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground">Total Requests</div>
                      <div className="text-lg font-semibold">{apiStats.totalRequests}</div>
                    </div>
                    <div className="p-4 border-t md:border-t-0 md:border-l border-border/50">
                      <div className="text-xs text-muted-foreground">Successful</div>
                      <div className="text-lg font-semibold text-green-500">{apiStats.successfulRequests}</div>
                    </div>
                    <div className="p-4 border-t md:border-l border-border/50">
                      <div className="text-xs text-muted-foreground">Failed</div>
                      <div className="text-lg font-semibold text-red-500">{apiStats.errorRequests}</div>
                    </div>
                    <div className="p-4 border-t md:border-l border-border/50">
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                      <div className="text-lg font-semibold">{apiStats.averageResponseTime}ms</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t border-border/50">
                    {/* Daily usage line chart */}
                    <div className="col-span-2 h-56 rounded-md bg-background">
                      {apiStats.dailyUsage && apiStats.dailyUsage.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={apiStats.dailyUsage} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 11, fill: 'rgba(230,233,239,0.7)' }}
                              tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis tick={{ fontSize: 11, fill: 'rgba(230,233,239,0.7)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <ReTooltip
                              contentStyle={{ background: '#0a0a0a', border: '1px solid #2f3336', borderRadius: 8 }}
                              labelFormatter={(d) => new Date(d as string).toLocaleDateString()}
                            />
                            <Line type="monotone" dataKey="count" stroke="#1a8cd8" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full grid place-items-center text-xs text-muted-foreground">No daily data</div>
                      )}
                    </div>

                    {/* Success vs Error bar */}
                    <div className="h-56 rounded-md bg-background">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ name: 'Requests', success: apiStats.successfulRequests, error: apiStats.errorRequests }]}
                          margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(230,233,239,0.7)' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: 'rgba(230,233,239,0.7)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                          <ReTooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #2f3336', borderRadius: 8 }} />
                          <Bar dataKey="success" fill="#16a34a" radius={[4,4,0,0]} />
                          <Bar dataKey="error" fill="#ef4444" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border/50">
                    <h4 className="text-sm font-medium mb-3">Top Endpoints</h4>
                    <div className="space-y-2">
                      {(apiStats.endpointUsage || apiStats.topEndpoints || []).slice(0, 5).map((endpoint) => {
                        const count = 'count' in endpoint ? endpoint.count : 'requests' in endpoint ? endpoint.requests : 0;
                        return (
                          <div key={endpoint.endpoint} className="flex items-center justify-between text-sm">
                            <code className="text-xs bg-muted/50 px-2 py-1 rounded">{endpoint.endpoint}</code>
                            <span className="font-medium">{count}</span>
                          </div>
                        );
                      })}
                      {(!apiStats.endpointUsage && !apiStats.topEndpoints) && (
                        <p className="text-sm text-muted-foreground">No endpoint data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
            </TabsContent>

            {/* Playground Tab */}
            <TabsContent value="playground" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    API Playground
                  </CardTitle>
                  <CardDescription>
                    Test your API keys with live email validation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="playground-api-key">API Key</Label>
                      <Input
                        id="playground-api-key"
                        type="password"
                        value={playgroundApiKey}
                        onChange={(e) => setPlaygroundApiKey(e.target.value)}
                        placeholder="tm_your_api_key_here"
                      />
                    </div>
                    <div>
                      <Label htmlFor="playground-email">Email to Test</Label>
                      <Input
                        id="playground-email"
                        value={playgroundEmail}
                        onChange={(e) => setPlaygroundEmail(e.target.value)}
                        placeholder="xepeg24004@merumart.com"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={testPlaygroundApi} disabled={playgroundLoading} className="w-full">
                    {playgroundLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Test API
                  </Button>

                  {playgroundResult && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Validation Results</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Valid:</span>
                            <Badge variant={playgroundResult.valid ? "default" : "destructive"}>
                              {playgroundResult.valid ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Syntax Valid:</span>
                            <Badge variant={playgroundResult.syntax_valid ? "default" : "destructive"}>
                              {playgroundResult.syntax_valid ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Disposable:</span>
                            <Badge variant={playgroundResult.disposable ? "destructive" : "default"}>
                              {playgroundResult.disposable === null ? "Unknown" : playgroundResult.disposable ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Role-based:</span>
                            <Badge variant={playgroundResult.role_based ? "secondary" : "default"}>
                              {playgroundResult.role_based === null ? "Unknown" : playgroundResult.role_based ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {playgroundResult.spammy !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Spammy:</span>
                              <Badge variant={playgroundResult.spammy ? "destructive" : "default"}>
                                {playgroundResult.spammy ? "Yes" : "No"}
                              </Badge>
                            </div>
                          )}
                          {playgroundResult.allowed_list !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Allowed List:</span>
                              <Badge variant={playgroundResult.allowed_list ? "default" : "secondary"}>
                                {playgroundResult.allowed_list ? "Yes" : "No"}
                              </Badge>
                            </div>
                          )}
                          {playgroundResult.confidence_score !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Confidence Score:</span>
                              <Badge variant={playgroundResult.confidence_score > 0.7 ? "default" : playgroundResult.confidence_score > 0.4 ? "secondary" : "destructive"}>
                                {(playgroundResult.confidence_score * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          )}
                          {playgroundResult.risk_level && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Risk Level:</span>
                              <Badge variant={playgroundResult.risk_level === 'low' ? "default" : playgroundResult.risk_level === 'medium' ? "secondary" : "destructive"}>
                                {playgroundResult.risk_level.charAt(0).toUpperCase() + playgroundResult.risk_level.slice(1)}
                              </Badge>
                            </div>
                          )}
                          {playgroundResult.personal_override && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Personal Override:</span>
                              <Badge variant="outline">
                                Active
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Reason</h5>
                            <p className="text-xs bg-muted p-2 rounded">{playgroundResult.reason}</p>
                          </div>
                          
                          {playgroundResult.suggestions && playgroundResult.suggestions.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium mb-2">Suggestions</h5>
                              <div className="space-y-1">
                                {playgroundResult.suggestions.map((suggestion, index) => (
                                  <p key={index} className="text-xs bg-muted p-2 rounded">
                                    • {suggestion}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {playgroundResult.cache_info && (
                            <div>
                              <h5 className="text-sm font-medium mb-2">Cache Info</h5>
                              <div className="text-xs bg-muted p-2 rounded space-y-1">
                                <p>Disposable domains: {playgroundResult.cache_info.disposable_domains_count.toLocaleString()}</p>
                                <p>Allowed domains: {playgroundResult.cache_info.allowed_domains_count.toLocaleString()}</p>
                                <p>Last updated: {new Date(playgroundResult.cache_info.last_updated).toLocaleString()}</p>
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Raw Response</h5>
                            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                              {JSON.stringify(playgroundResult, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Lists Tab */}
            <TabsContent value="personal-lists" className="space-y-6">
              <PersonalListsClient />
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="docs" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">1. Create an API Key</h4>
                      <p className="text-sm text-muted-foreground">
                        Go to the Overview tab and create your first API key. Choose a descriptive name and set your monthly quota.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">2. Make Your First Request</h4>
                      <p className="text-sm text-muted-foreground">
                        Use the playground to test your API key, or make a POST request to /api/v2/validate with your API key in the X-API-Key header.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">3. Monitor Usage</h4>
                      <p className="text-sm text-muted-foreground">
                        Track your API usage and monitor your monthly quota in the analytics section.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Reference</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Endpoint</h4>
                      <code className="text-xs bg-muted px-2 py-1 rounded">POST /api/v2/validate</code>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Headers</h4>
                      <div className="space-y-1">
                        <code className="text-xs bg-muted px-2 py-1 rounded block">Content-Type: application/json</code>
                        <code className="text-xs bg-muted px-2 py-1 rounded block">X-API-Key: tm_your_api_key</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Request Body</h4>
                      <pre className="text-xs bg-muted p-3 rounded">
{`{
  "email": "xepeg24004@merumart.com"
}`}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Enhanced Response</h4>
                      <pre className="text-xs bg-muted p-3 rounded overflow-auto">
{`{
  "email": "xepeg24004@merumart.com",
  "domain": "merumart.com",
  "valid": false,
  "syntax_valid": true,
  "disposable": true,
  "role_based": false,
  "mx_records": true,
  "spammy": true,
  "allowed_list": false,
  "confidence_score": 0.1,
  "risk_level": "high",
  "suggestions": [
    "This domain is known for providing temporary/disposable email addresses"
  ],
  "personal_override": false,
  "reason": "Disposable email detected",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "cache_info": {
    "disposable_domains_count": 12847,
    "allowed_domains_count": 156,
    "last_updated": "2024-01-15T08:00:00.000Z"
  }
}`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="curl" className="w-full">
                    <TabsList>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curl">
                      <pre className="text-xs bg-muted p-4 rounded overflow-auto">
{`curl -X POST http://localhost:3000/api/v2/validate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: tm_your_api_key_here" \\
  -d '{"email": "xepeg24004@merumart.com"}'`}
                      </pre>
                    </TabsContent>
                    <TabsContent value="javascript">
                      <pre className="text-xs bg-muted p-4 rounded overflow-auto">
{`const response = await fetch('/api/v2/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'tm_your_api_key_here'
  },
  body: JSON.stringify({ email: 'xepeg24004@merumart.com' })
});

const result = await response.json();
console.log(result);`}
                      </pre>
                    </TabsContent>
                    <TabsContent value="python">
                      <pre className="text-xs bg-muted p-4 rounded overflow-auto">
{`import requests

response = requests.post(
    'http://localhost:3000/api/v2/validate',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': 'tm_your_api_key_here'
    },
    json={'email': 'xepeg24004@merumart.com'}
)

result = response.json()
print(result)`}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
