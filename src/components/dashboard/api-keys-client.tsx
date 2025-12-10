"use client";

import { useUser } from "@stackframe/stack";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  Button,
  Input,
  Badge,
  Title,
  Text,
  ActionIcon,
  Modal,
  Tooltip,
} from "rizzui";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ApiKeysClient() {
  const user = useUser();
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR('/api/dashboard/api-keys', fetcher);
  
  const apiKeys = (data as { apiKeys: ApiKey[] } | undefined)?.apiKeys || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      setIsCreating(true);
      const response = await fetch('/api/dashboard/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName.trim(),
          monthlyQuota: 5000 // Default quota
        })
      });

      if (response.ok) {
        const data = await response.json() as { secretKey: string };
        setCreatedKey(data.secretKey);
        setNewKeyName("");
        mutate('/api/dashboard/api-keys');
        toast.success("API Key created successfully");
      } else {
        console.error("Failed to create API key");
        toast.error("Failed to create API key");
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error("An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;
    try {
      const response = await fetch(`/api/dashboard/api-keys/${keyId}`, { method: 'DELETE' });
      if (response.ok) {
        mutate('/api/dashboard/api-keys');
        toast.success("API Key deleted");
      } else {
        console.error("Failed to delete API key");
        toast.error("Failed to delete API key");
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error("An error occurred");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setCreatedKey(null);
    setNewKeyName("");
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-6">
        <div>
          <Title as="h2" className="text-2xl font-bold tracking-tight">API Keys</Title>
          <Text className="text-muted-foreground mt-1">
            Manage your API keys to access the TruMailer API.
          </Text>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Key
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <Title as="h3" className="text-lg font-semibold">Failed to load API keys</Title>
          <Text className="text-muted-foreground">Please try refreshing the page.</Text>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No API keys found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create an API key to authenticate your requests to the TrueMailer API.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-muted bg-card hover:shadow-sm transition-shadow gap-4"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Text className="font-medium truncate">{key.name}</Text>
                  <Badge variant={key.isActive ? "flat" : "outline"} color={key.isActive ? "success" : "danger"} size="sm">
                    {key.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded w-fit">
                  <span>{key.keyPreview}••••••••</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span>Created: {format(new Date(key.createdAt), "MMM d, yyyy")}</span>
                  {key.lastUsedAt && (
                    <span>Last used: {format(new Date(key.lastUsedAt), "MMM d, yyyy HH:mm")}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="flex flex-col items-end mr-4">
                  <Text className="text-sm font-medium">
                    {key.currentUsage.toLocaleString()} / {key.monthlyQuota.toLocaleString()}
                  </Text>
                  <Text className="text-xs text-muted-foreground">Monthly Requests</Text>
                </div>
                <Tooltip content="Delete Key">
                  <ActionIcon
                    variant="outline"
                    color="danger"
                    onClick={() => deleteApiKey(key.id)}
                    className="hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </ActionIcon>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={handleCloseModal}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Title as="h3" className="text-lg font-semibold">
              {createdKey ? "API Key Created" : "Create New API Key"}
            </Title>
            <ActionIcon size="sm" variant="text" onClick={handleCloseModal}>
              <Trash2 className="w-4 h-4" />
            </ActionIcon>
          </div>

          {createdKey ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 p-4 rounded-md">
                <Text className="text-green-800 dark:text-green-200 text-sm mb-2 font-medium">
                  This is your only chance to view this key. Please save it somewhere safe.
                </Text>
                <div className="flex items-center gap-2 bg-background p-2 rounded border border-green-200 dark:border-green-900">
                  <code className="flex-1 font-mono text-sm break-all">{createdKey}</code>
                  <ActionIcon
                    size="sm"
                    variant="text"
                    onClick={() => copyToClipboard(createdKey, "new-key")}
                  >
                    {copiedKey === "new-key" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </ActionIcon>
                </div>
              </div>
              <Button className="w-full" onClick={handleCloseModal}>
                I have saved my key
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Key Name"
                placeholder="e.g., Production App, Development"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  onClick={createApiKey}
                  isLoading={isCreating}
                  disabled={!newKeyName.trim()}
                >
                  Create Key
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
