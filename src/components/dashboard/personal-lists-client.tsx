"use client";

import { useState, useEffect } from "react";
import { Badge, Button, Input, Textarea, Modal, Title, Text, ActionIcon } from "rizzui";
import {
  Shield, ShieldCheck, Plus, Trash2, Loader2,
  Mail, Globe, AlertTriangle
} from "lucide-react";

interface PersonalListEntry {
  id: number;
  emailOrDomain: string;
  type: 'email' | 'domain';
  reason?: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  blocklist?: PersonalListEntry[];
  whitelist?: PersonalListEntry[];
  error?: string;
  entry?: PersonalListEntry;
  message?: string;
}

export function PersonalListsClient() {
  const [blocklist, setBlocklist] = useState<PersonalListEntry[]>([]);
  const [whitelist, setWhitelist] = useState<PersonalListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [newEntry, setNewEntry] = useState({
    emailOrDomain: "",
    type: "email" as 'email' | 'domain',
    reason: ""
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'blocklist' | 'whitelist'>('blocklist');

  // Bulk add state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkListType, setBulkListType] = useState<'blocklist' | 'whitelist'>('blocklist');
  const [bulkText, setBulkText] = useState("");
  const [bulkType, setBulkType] = useState<'auto' | 'email' | 'domain'>('auto');
  const [bulkReason, setBulkReason] = useState("");
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'blocklist' | 'whitelist'>('blocklist');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError("");

      const [blocklistResponse, whitelistResponse] = await Promise.all([
        fetch('/api/dashboard/blocklist'),
        fetch('/api/dashboard/whitelist')
      ]);

      if (!blocklistResponse.ok || !whitelistResponse.ok) {
        throw new Error('Failed to fetch personal lists');
      }

      const blocklistData = await blocklistResponse.json() as ApiResponse;
      const whitelistData = await whitelistResponse.json() as ApiResponse;

      setBlocklist(blocklistData.blocklist || []);
      setWhitelist(whitelistData.whitelist || []);
    } catch (error) {
      console.error('Error fetching personal lists:', error);
      setError('Failed to load personal lists');
    } finally {
      setLoading(false);
    }
  };

  const addToList = async (listType: 'blocklist' | 'whitelist') => {
    if (!newEntry.emailOrDomain.trim()) {
      setError('Please enter an email or domain');
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const endpoint = listType === 'blocklist' ? '/api/dashboard/blocklist' : '/api/dashboard/whitelist';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiResponse;
        throw new Error(errorData.error || 'Failed to add entry');
      }

      setNewEntry({ emailOrDomain: "", type: "email", reason: "" });
      setDialogOpen(false);
      await fetchLists();
    } catch (error) {
      console.error(`Error adding to ${listType}:`, error);
      setError(error instanceof Error ? error.message : `Failed to add to ${listType}`);
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromList = async (listType: 'blocklist' | 'whitelist', id: number) => {
    try {
      setActionLoading(true);
      setError("");

      const endpoint = listType === 'blocklist' ? '/api/dashboard/blocklist' : '/api/dashboard/whitelist';
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiResponse;
        throw new Error(errorData.error || 'Failed to remove entry');
      }

      await fetchLists();
    } catch (error) {
      console.error(`Error removing from ${listType}:`, error);
      setError(error instanceof Error ? error.message : `Failed to remove from ${listType}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openAddDialog = (listType: 'blocklist' | 'whitelist') => {
    setDialogType(listType);
    setDialogOpen(true);
    setError("");
  };

  const openBulkDialog = (listType: 'blocklist' | 'whitelist') => {
    setBulkListType(listType);
    setBulkOpen(true);
    setError("");
  };

  const addBulkToList = async () => {
    const lines = bulkText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    if (lines.length === 0) {
      setError('Please paste one or more emails/domains');
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setBulkProgress({ current: 0, total: lines.length });

      const endpoint = bulkListType === 'blocklist' ? '/api/dashboard/blocklist' : '/api/dashboard/whitelist';
      for (let i = 0; i < lines.length; i++) {
        const value = lines[i];
        const inferredType: 'email' | 'domain' = bulkType === 'auto' ? (value.includes('@') ? 'email' : 'domain') : bulkType;
        try {
          await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrDomain: value, type: inferredType, reason: bulkReason })
          });
        } catch {
          // ignore individual failures, continue
        }
        setBulkProgress({ current: i + 1, total: lines.length });
      }

      setBulkOpen(false);
      setBulkText("");
      setBulkReason("");
      setBulkType('auto');
      setBulkProgress(null);
      await fetchLists();
    } catch (err) {
      console.error('Bulk add error', err);
      setError('Bulk add failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card/50 border border-primary/20 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const currentList = activeTab === 'blocklist' ? blocklist : whitelist;
  const ListIcon = activeTab === 'blocklist' ? Shield : ShieldCheck;
  const iconColor = activeTab === 'blocklist' ? 'text-red-500' : 'text-green-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title as="h2" className="text-2xl font-bold">Personal Lists</Title>
        <Text className="text-muted-foreground">
          Manage your personal blocklist and whitelist to override default email validation results.
          Whitelist entries always take precedence over blocklist entries.
        </Text>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <Text className="text-red-600">{error}</Text>
        </div>
      )}

      {/* Custom Tabs */}
      <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('blocklist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'blocklist'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            }`}
        >
          <Shield className="h-4 w-4" />
          Blocklist ({blocklist.length})
        </button>
        <button
          onClick={() => setActiveTab('whitelist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'whitelist'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Whitelist ({whitelist.length})
        </button>
      </div>

      {/* List Content */}
      <div className="bg-card/50 border border-primary/20 rounded-xl">
        <div className="p-6 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ListIcon className={`h-5 h-5 ${iconColor}`} />
                <Title as="h3" className="text-xl font-bold">
                  {activeTab === 'blocklist' ? 'Blocklist' : 'Whitelist'}
                </Title>
              </div>
              <Text className="text-sm text-muted-foreground mt-1">
                {activeTab === 'blocklist'
                  ? 'Emails and domains in this list will always be marked as invalid, regardless of other validation checks.'
                  : 'Emails and domains in this list will always be marked as valid, overriding all other validation checks including blocklist entries.'}
              </Text>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => openAddDialog(activeTab)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
              <Button variant="outline" onClick={() => openBulkDialog(activeTab)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Bulk Add
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {currentList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ListIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <Text>No entries in your {activeTab}</Text>
              <Text className="text-sm">
                Add emails or domains to {activeTab === 'blocklist' ? 'block them from validation' : 'always mark them as valid'}.
              </Text>
            </div>
          ) : (
            <div className="space-y-3">
              {currentList.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    {entry.type === 'email' ? (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <Text className="font-medium">{entry.emailOrDomain}</Text>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {entry.type}
                        </Badge>
                        {entry.reason && <span>• {entry.reason}</span>}
                        <span>• {new Date(entry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <ActionIcon
                    variant="text"
                    size="sm"
                    onClick={() => removeFromList(activeTab, entry.id)}
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </ActionIcon>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      <Modal isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="p-6">
          <div className="mb-4">
            <Title as="h3" className="text-lg font-semibold">
              Add to {dialogType === 'blocklist' ? 'Blocklist' : 'Whitelist'}
            </Title>
            <Text className="text-sm text-muted-foreground">
              {dialogType === 'blocklist'
                ? 'Add an email or domain to block from validation.'
                : 'Add an email or domain to always mark as valid.'}
            </Text>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                value={newEntry.type}
                onChange={(e) => setNewEntry(prev => ({ ...prev, type: e.target.value as 'email' | 'domain' }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="email">Email Address</option>
                <option value="domain">Domain</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {newEntry.type === 'email' ? 'Email Address' : 'Domain'}
              </label>
              <Input
                placeholder={newEntry.type === 'email' ? 'user@example.com' : 'example.com'}
                value={newEntry.emailOrDomain}
                onChange={(e) => setNewEntry(prev => ({ ...prev, emailOrDomain: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason (Optional)</label>
              <Textarea
                placeholder="Why are you adding this entry?"
                value={newEntry.reason}
                onChange={(e) => setNewEntry(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => addToList(dialogType)}
                disabled={actionLoading || !newEntry.emailOrDomain.trim()}
              >
                {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Entry
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Bulk Add Modal */}
      <Modal isOpen={bulkOpen} onClose={() => setBulkOpen(false)}>
        <div className="p-6 max-w-lg">
          <div className="mb-4">
            <Title as="h3" className="text-lg font-semibold">
              Bulk add to {bulkListType === 'blocklist' ? 'Blocklist' : 'Whitelist'}
            </Title>
            <Text className="text-sm text-muted-foreground">
              Paste one item per line. Choose type or use Auto to infer by "@".
            </Text>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                value={bulkType}
                onChange={(e) => setBulkType(e.target.value as 'auto' | 'email' | 'domain')}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="auto">Auto (detect)</option>
                <option value="email">Email</option>
                <option value="domain">Domain</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entries</label>
              <Textarea
                placeholder={"user@example.com\nexample.com\n..."}
                rows={10}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
              <Text className="text-xs text-muted-foreground">
                {bulkText.split(/\r?\n/).filter((l) => l.trim()).length} items
              </Text>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason (optional)</label>
              <Input value={bulkReason} onChange={(e) => setBulkReason(e.target.value)} placeholder="e.g. disposable provider" />
            </div>

            <div className="flex justify-end gap-2 items-center">
              {bulkProgress && (
                <Text className="text-xs text-muted-foreground mr-auto">
                  Adding {bulkProgress.current}/{bulkProgress.total}
                </Text>
              )}
              <Button variant="outline" onClick={() => setBulkOpen(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button onClick={addBulkToList} disabled={actionLoading || bulkText.trim().length === 0}>
                {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Add All
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
