"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import {
  Button,
  Input,
  Badge,
  Title,
  Text,
  ActionIcon,
  Password,
  Modal
} from "rizzui";
import { AuthButtons } from "@/components/auth-buttons";
import {
  User, Clock, Key, BarChart3,
  Plus, Copy, Eye, EyeOff, Trash2, Loader2, Code, BookOpen, Play, ShieldCheck,
  X
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
import { PersonalListsClient } from "./personal-lists-client";
import { DocsClient } from "./docs-client";

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

type Section = "overview" | "keys" | "playground" | "personal-lists" | "docs";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

async function sendRequest(url: string, { arg }: { arg: { email: string, apiKey: string } }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': arg.apiKey
    },
    body: JSON.stringify({ email: arg.email })
  });
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // @ts-expect-error Adding custom properties to error object
    error.info = await response.json()
    // @ts-expect-error Adding custom properties to error object
    error.status = response.status
    throw error
  }
  return response.json()
}

export function DashboardClient({ section }: { section?: Section } = {}) {
  const user = useUser();
  const { mutate } = useSWRConfig();

  const { data: apiKeysData, error: apiKeysError } = useSWR('/api/dashboard/api-keys', fetcher) as { data: { apiKeys: ApiKey[] } | undefined, error: Error | null };
  const { data: apiStatsData, error: apiStatsError } = useSWR('/api/dashboard/analytics', fetcher) as { data: { stats: ApiStats } | undefined, error: Error | null };

  const { trigger, isMutating } = useSWRMutation('/api/v2/validate', sendRequest, {
    onSuccess: (data) => {
      setPlaygroundResult(data as PlaygroundResult);
    },

    onError: (error) => {
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
    }
  });

  const apiKeys: ApiKey[] = apiKeysData?.apiKeys || [];
  const apiStats: ApiStats | null = apiStatsData?.stats || null;

  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyQuota, setNewKeyQuota] = useState(5000);
  const [showNewKey, setShowNewKey] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Playground state
  const [playgroundEmail, setPlaygroundEmail] = useState("xepeg24004@100likers.com");
  const [playgroundApiKey, setPlaygroundApiKey] = useState("");
  const [playgroundResult, setPlaygroundResult] = useState<PlaygroundResult | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Section>(section ?? "overview");

  useEffect(() => {
    if (section) {
      setActiveTab(section);
      return;
    }
    const q = (searchParams?.get("tab") as Section | null) || "overview";
    setActiveTab(q);
  }, [section, searchParams]);

  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const syncUser = async () => {
    try {
      const response = await fetch('/api/auth/sync-user', { method: 'POST' });
      if (response.ok) {
        mutate('/api/dashboard/api-keys');
        mutate('/api/dashboard/analytics');
      }
    } catch (error) {
      console.error('Failed to sync user:', error);
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
        mutate('/api/dashboard/api-keys');
        setIsCreateDialogOpen(false);
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
      const response = await fetch(`/api/dashboard/api-keys/${keyId}`, { method: 'DELETE' });
      if (response.ok) mutate('/api/dashboard/api-keys');
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) newVisible.delete(keyId);
    else newVisible.add(keyId);
    setVisibleKeys(newVisible);
  };

  const handleTabChange = (v: Section) => {
    setActiveTab(v);
    if (pathname?.startsWith("/dashboard/")) {
      router.replace(`/dashboard/${v}`, { scroll: false });
    } else {
      const params = new URLSearchParams(searchParams ?? undefined);
      params.set("tab", v);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Title as="h1" className="text-3xl font-bold mb-4">API Dashboard</Title>
          <Text className="text-muted-foreground mb-6">Please sign in to access your API dashboard</Text>
          <AuthButtons />
        </div>
      </div>
    );
  }

  const header = {
    overview: { title: "Overview", desc: "Usage analytics and key highlights.", icon: BarChart3 },
    keys: { title: "API Keys", desc: "Create and manage your API keys.", icon: Key },
    playground: { title: "Playground", desc: "Test email validation with your API key.", icon: Code },
    "personal-lists": { title: "Personal Lists", desc: "Manage your blocklist and whitelist.", icon: ShieldCheck },
    docs: { title: "Documentation", desc: "Integrate the TruMailer API v2 in minutes.", icon: BookOpen },
  }[activeTab];

  const loading = !apiKeysData && !apiKeysError && !apiStatsData && !apiStatsError;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 text-primary p-2">
              <header.icon className="w-5 h-5" />
            </div>
            <div>
              <Title as="h1" className="text-2xl font-semibold tracking-tight leading-tight">{header.title}</Title>
              <Text className="text-sm text-muted-foreground">{header.desc}</Text>
            </div>
          </div>
          <AuthButtons />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {!section && (
              <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg overflow-x-auto">
                {(["overview", "keys", "playground", "personal-lists", "docs"] as Section[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                      }`}
                  >
                    {tab === "personal-lists" ? "Personal Lists" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    <div className="p-4 flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Text className="text-xs text-muted-foreground">Account</Text>
                        <Text className="text-sm font-medium">{user.displayName || 'User'}</Text>
                      </div>
                    </div>
                    <div className="p-4 flex items-center gap-3 border-t md:border-t-0 md:border-l border-primary/10">
                      <Key className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Text className="text-xs text-muted-foreground">API Keys</Text>
                        <Text className="text-sm font-medium">{apiKeys.length} active</Text>
                      </div>
                    </div>
                    <div className="p-4 flex items-center gap-3 border-t md:border-l border-primary/10">
                      <BarChart3 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Text className="text-xs text-muted-foreground">This Month</Text>
                        <Text className="text-sm font-medium">{apiStats?.totalRequests || 0} req</Text>
                      </div>
                    </div>
                    <div className="p-4 flex items-center gap-3 border-t md:border-l border-primary/10">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Text className="text-xs text-muted-foreground">Avg Response</Text>
                        <Text className="text-sm font-medium">{apiStats?.averageResponseTime || 0}ms</Text>
                      </div>
                    </div>
                  </div>
                </div>

                {apiStats && (
                  <section aria-labelledby="analytics" className="space-y-3">
                    <Title as="h3" id="analytics" className="text-base font-semibold flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-muted-foreground" />
                      Usage Analytics
                    </Title>
                    <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-4">
                        <div className="p-4">
                          <Text className="text-xs text-muted-foreground">Total Requests</Text>
                          <Text className="text-lg font-semibold">{apiStats.totalRequests}</Text>
                        </div>
                        <div className="p-4 border-t md:border-t-0 md:border-l border-primary/10">
                          <Text className="text-xs text-muted-foreground">Successful</Text>
                          <Text className="text-lg font-semibold text-green-500">{apiStats.successfulRequests}</Text>
                        </div>
                        <div className="p-4 border-t md:border-l border-primary/10">
                          <Text className="text-xs text-muted-foreground">Failed</Text>
                          <Text className="text-lg font-semibold text-red-500">{apiStats.errorRequests}</Text>
                        </div>
                        <div className="p-4 border-t md:border-l border-primary/10">
                          <Text className="text-xs text-muted-foreground">Avg Response</Text>
                          <Text className="text-lg font-semibold">{apiStats.averageResponseTime}ms</Text>
                        </div>
                      </div>
                      {/* Charts section kept as div structure for Recharts responsiveness */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t border-primary/10">
                        <div className="col-span-2 h-56 rounded-md bg-background/50">
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

                        <div className="h-56 rounded-md bg-background/50">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: 'Requests', success: apiStats.successfulRequests, error: apiStats.errorRequests }]}
                              margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(230,233,239,0.7)' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11, fill: 'rgba(230,233,239,0.7)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                              <ReTooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #2f3336', borderRadius: 8 }} />
                              <Bar dataKey="success" fill="#16a34a" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="error" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="p-4 border-t border-primary/10">
                        <Title as="h4" className="text-sm font-medium mb-3">Top Endpoints</Title>
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
                            <Text className="text-sm text-muted-foreground">No endpoint data available</Text>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === "keys" && (
              <div className="space-y-6">
                <section aria-labelledby="keys" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Title as="h3" id="keys" className="text-base font-semibold">API Keys</Title>
                    <Button size="sm" className="rounded-full px-4" onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Key
                    </Button>
                  </div>

                  <Modal isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
                    <div className="p-6">
                      <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                        <Title as="h3" className="text-lg font-semibold leading-none tracking-tight">Create New API Key</Title>
                        <Text className="text-sm text-muted-foreground">Create a new API key to access the TruMailer API v2</Text>
                      </div>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none">Key Name</label>
                          <Input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. Production API Key" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none">Monthly Quota</label>
                          <Input type="number" value={newKeyQuota} onChange={(e) => setNewKeyQuota(parseInt(e.target.value) || 5000)} min={1000} max={100000} />
                        </div>
                      </div>
                      <Button onClick={createApiKey} disabled={creating || !newKeyName.trim()} className="w-full">
                        {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Create API Key
                      </Button>
                    </div>
                  </Modal>

                  {showNewKey && (
                    <div className="rounded-lg border border-border/50 p-3 bg-muted/40">
                      <Text className="text-xs text-muted-foreground mb-2">New API key created. Copy and store it securely.</Text>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-background px-3 py-2 rounded border border-border/50 text-xs overflow-x-auto">{showNewKey}</code>
                        <ActionIcon size="sm" variant="outline" onClick={() => copyToClipboard(showNewKey)} className="rounded-full">
                          <Copy className="w-4 h-4" />
                        </ActionIcon>
                      </div>
                      <Button size="sm" variant="text" onClick={() => setShowNewKey("")} className="mt-2 text-muted-foreground">Dismiss</Button>
                    </div>
                  )}

                  {apiKeys.length === 0 ? (
                    <div className="bg-card/50 border border-primary/20 rounded-xl p-6 text-center">
                      <Text className="text-sm text-muted-foreground">No API keys yet</Text>
                      <Text className="text-xs text-muted-foreground">Create your first API key to start.</Text>
                    </div>
                  ) : (
                    <div className="bg-card/50 border border-primary/20 rounded-xl overflow-hidden">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead className="[&_tr]:border-b [&_tr]:border-primary/10">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Key</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usage</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {apiKeys.map((key) => (
                              <tr key={key.id} className="border-b border-primary/10 transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-medium">{key.name}</td>
                                <td className="p-4 align-middle">
                                  <code className="bg-muted/50 px-2 py-1 rounded text-xs">
                                    {visibleKeys.has(key.id) ? key.keyPreview : '•'.repeat(32)}
                                  </code>
                                </td>
                                <td className="p-4 align-middle text-muted-foreground">
                                  {key.currentUsage}/{key.monthlyQuota}
                                </td>
                                <td className="p-4 align-middle text-muted-foreground">
                                  {new Date(key.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge
                                    color={key.isActive ? "success" : "secondary"}
                                    variant="flat"
                                  >
                                    {key.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle text-right">
                                  <div className="flex justify-end gap-1">
                                    <ActionIcon size="sm" variant="text" onClick={() => toggleKeyVisibility(key.id)}>
                                      {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </ActionIcon>
                                    <ActionIcon size="sm" variant="text" onClick={() => copyToClipboard(key.keyPreview)}>
                                      <Copy className="w-4 h-4" />
                                    </ActionIcon>
                                    <ActionIcon size="sm" variant="text" className="text-red-500 hover:text-red-700" onClick={() => deleteApiKey(key.id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </ActionIcon>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === "playground" && (
              <div className="space-y-6">
                <div className="bg-card/50 border border-primary/20 rounded-xl">
                  <div className="p-6 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-primary" />
                      <div>
                        <Title as="h3" className="text-xl font-bold">Validation Playground</Title>
                        <Text className="text-sm text-muted-foreground">Test your API keys with live email validation</Text>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">API Key</label>
                        <Password
                          value={playgroundApiKey}
                          onChange={(e) => setPlaygroundApiKey(e.target.value)}
                          placeholder="tm_your_api_key_here"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email to Test</label>
                        <Input
                          value={playgroundEmail}
                          onChange={(e) => setPlaygroundEmail(e.target.value)}
                          placeholder="xepeg24004@100likers.com"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => trigger({ email: playgroundEmail, apiKey: playgroundApiKey })}
                      disabled={isMutating}
                      className="w-full"
                    >
                      {isMutating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                      Validate
                    </Button>
                    <Text className="text-xs text-muted-foreground">We never store your API key.</Text>

                    {playgroundResult && (
                      <div className="mt-6 border-t border-primary/10 pt-6">
                        <Title as="h4" className="text-sm font-medium mb-3">Validation Results</Title>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge color={playgroundResult.valid ? "success" : "danger"} variant="flat">
                            {playgroundResult.valid ? 'Valid' : 'Invalid'}
                          </Badge>
                          <Badge variant="outline">
                            Syntax {playgroundResult.syntax_valid ? 'OK' : 'Error'}
                          </Badge>
                          <Badge color={playgroundResult.risk_level === 'low' ? "success" : playgroundResult.risk_level === 'medium' ? "warning" : "danger"} variant="flat">
                            Risk: {playgroundResult.risk_level}
                          </Badge>
                        </div>

                        <div className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                          <pre>{JSON.stringify(playgroundResult, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "personal-lists" && (
              <div className="space-y-6">
                <PersonalListsClient />
              </div>
            )}

            {activeTab === "docs" && (
              <div className="space-y-6">
                <DocsClient />
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
