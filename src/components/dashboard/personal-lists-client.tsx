"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Shield, ShieldCheck, Plus, Trash2, Loader2, 
  Mail, Globe, AlertTriangle, CheckCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Fetch lists on component mount
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

      // Reset form and close dialog
      setNewEntry({ emailOrDomain: "", type: "email", reason: "" });
      setDialogOpen(false);
      
      // Refresh lists
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

      // Refresh lists
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Personal Lists</h2>
        <p className="text-muted-foreground">
          Manage your personal blocklist and whitelist to override default email validation results.
          Whitelist entries always take precedence over blocklist entries.
        </p>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-red-600">{error}</span>
        </div>
      )}

      <Tabs defaultValue="blocklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blocklist" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Blocklist ({blocklist.length})
          </TabsTrigger>
          <TabsTrigger value="whitelist" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Whitelist ({whitelist.length})
          </TabsTrigger>
        </TabsList>

        {/* Blocklist Tab */}
        <TabsContent value="blocklist" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 h-5 text-red-500" />
                    Blocklist
                  </CardTitle>
                  <CardDescription>
                    Emails and domains in this list will always be marked as invalid, regardless of other validation checks.
                  </CardDescription>
                </div>
                <Button onClick={() => openAddDialog('blocklist')} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blocklist.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No entries in your blocklist</p>
                  <p className="text-sm">Add emails or domains to block them from validation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blocklist.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {entry.type === 'email' ? (
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{entry.emailOrDomain}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {entry.type}
                            </Badge>
                            {entry.reason && <span>• {entry.reason}</span>}
                            <span>• {new Date(entry.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromList('blocklist', entry.id)}
                        disabled={actionLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Whitelist Tab */}
        <TabsContent value="whitelist" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 h-5 text-green-500" />
                    Whitelist
                  </CardTitle>
                  <CardDescription>
                    Emails and domains in this list will always be marked as valid, overriding all other validation checks including blocklist entries.
                  </CardDescription>
                </div>
                <Button onClick={() => openAddDialog('whitelist')} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {whitelist.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No entries in your whitelist</p>
                  <p className="text-sm">Add emails or domains to always mark them as valid.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {whitelist.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {entry.type === 'email' ? (
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{entry.emailOrDomain}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {entry.type}
                            </Badge>
                            {entry.reason && <span>• {entry.reason}</span>}
                            <span>• {new Date(entry.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromList('whitelist', entry.id)}
                        disabled={actionLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add to {dialogType === 'blocklist' ? 'Blocklist' : 'Whitelist'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'blocklist' 
                ? 'Add an email or domain to block from validation.'
                : 'Add an email or domain to always mark as valid.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newEntry.type}
                onValueChange={(value: 'email' | 'domain') => 
                  setNewEntry(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Address</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailOrDomain">
                {newEntry.type === 'email' ? 'Email Address' : 'Domain'}
              </Label>
              <Input
                id="emailOrDomain"
                placeholder={
                  newEntry.type === 'email' 
                    ? 'user@example.com'
                    : 'example.com'
                }
                value={newEntry.emailOrDomain}
                onChange={(e) => 
                  setNewEntry(prev => ({ ...prev, emailOrDomain: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Why are you adding this entry?"
                value={newEntry.reason}
                onChange={(e) => 
                  setNewEntry(prev => ({ ...prev, reason: e.target.value }))
                }
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
        </DialogContent>
      </Dialog>
    </div>
  );
}