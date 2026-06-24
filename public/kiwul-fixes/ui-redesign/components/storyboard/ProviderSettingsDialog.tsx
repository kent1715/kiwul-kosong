'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  TestTube2,
  CheckCircle,
  XCircle,
  Loader2,
  Server,
  Star,
  PowerOff,
  AlertTriangle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useStoryboardStore } from '@/lib/store/storyboard-store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProviderWithId {
  id: string;
  type: string;
  name: string;
  provider: string;
  base_url: string;
  endpoint: string | null;
  model: string;
  api_key: string | null;
  timeout_seconds: number;
  is_default: boolean;
  is_active: boolean;
  config_json: string;
}

interface ProviderFormData {
  name: string;
  provider: string;
  base_url: string;
  endpoint: string;
  model: string;
  api_key: string;
  timeout_seconds: number;
  is_default: boolean;
  is_active: boolean;
}

const EMPTY_FORM: ProviderFormData = {
  name: '',
  provider: 'openai_compatible',
  base_url: '',
  endpoint: '',
  model: '',
  api_key: '',
  timeout_seconds: 600,
  is_default: false,
  is_active: true,
};

export function ProviderSettingsDialog() {
  const { providerSettingsDialogOpen, setProviderSettingsDialogOpen } = useStoryboardStore();
  const [providers, setProviders] = useState<ProviderWithId[]>([]);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProviderFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch providers on dialog open
  useEffect(() => {
    if (providerSettingsDialogOpen) {
      fetchProviders();
    }
  }, [providerSettingsDialogOpen]);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/storyboard/providers');
      const data = await res.json();
      if (data.ok) {
        setProviders(data.providers || []);
      }
    } catch {
      // Silently fail
    }
  };

  const filteredProviders = providers.filter(p => p.type === activeTab);
  const accentColor = activeTab === 'image' ? 'var(--col-image)' : 'var(--col-video)';

  const handleNew = useCallback(() => {
    setEditingId(null);
    setIsNew(true);
    setForm({ ...EMPTY_FORM });
    setTestResult(null);
  }, []);

  const handleEdit = useCallback((provider: ProviderWithId) => {
    setEditingId(provider.id);
    setIsNew(false);
    setForm({
      name: provider.name,
      provider: provider.provider,
      base_url: provider.base_url,
      endpoint: provider.endpoint || '',
      model: provider.model,
      api_key: provider.api_key || '',
      timeout_seconds: provider.timeout_seconds,
      is_default: provider.is_default,
      is_active: provider.is_active,
    });
    setTestResult(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.name || !form.base_url || !form.model) {
      toast.error('Name, Base URL, and Model are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId && !isNew) {
        // Update existing provider
        const res = await fetch(`/api/storyboard/providers/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            type: activeTab,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          toast.success('Provider updated');
        } else {
          toast.error(data.error || 'Failed to update provider');
        }
      } else {
        // Create new provider
        const res = await fetch('/api/storyboard/providers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            type: activeTab,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          toast.success('Provider created');
        } else {
          toast.error(data.error || 'Failed to create provider');
        }
      }
      fetchProviders();
      setEditingId(null);
      setIsNew(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Failed to save provider');
    } finally {
      setSaving(false);
    }
  }, [form, activeTab, editingId, isNew]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/storyboard/providers/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Provider deleted');
        fetchProviders();
        if (editingId === id) {
          setEditingId(null);
          setIsNew(false);
          setForm(EMPTY_FORM);
        }
      } else {
        toast.error(data.error || 'Failed to delete provider');
      }
    } catch {
      toast.error('Failed to delete provider');
    }
  }, [editingId]);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteConfirmId) return;
    handleDelete(deleteConfirmId);
    setDeleteConfirmId(null);
  }, [deleteConfirmId, handleDelete]);

  const handleTest = useCallback(async () => {
    if (!form.base_url) {
      toast.error('Base URL is required for testing');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/storyboard/providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_url: form.base_url,
          type: activeTab,
          api_key: form.api_key,
          endpoint: form.endpoint || undefined,
        }),
      });
      const data = await res.json();
      setTestResult({
        ok: data.ok,
        message: data.ok ? data.message : (data.message || data.error || 'Connection failed'),
      });
    } catch {
      setTestResult({ ok: false, message: 'Connection failed - server error' });
    } finally {
      setTesting(false);
    }
  }, [form, activeTab]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsNew(false);
    setForm(EMPTY_FORM);
    setTestResult(null);
  }, []);

  const isEditing = isNew || !!editingId;

  return (
    <Dialog open={providerSettingsDialogOpen} onOpenChange={setProviderSettingsDialogOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Provider Settings
          </DialogTitle>
          <DialogDescription>
            Configure image and video generation providers.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'image' | 'video')}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <TabsList className="shrink-0 self-start">
            <TabsTrigger value="image" className="text-xs">Image Providers</TabsTrigger>
            <TabsTrigger value="video" className="text-xs">Video Providers</TabsTrigger>
          </TabsList>

          <div className="mt-3 flex gap-4 min-h-0 flex-1 overflow-hidden">
            {/* Provider List */}
            <div className="w-60 shrink-0 flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={handleNew}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-1.5 pr-1">
                  {filteredProviders.map((provider) => {
                    const isSelected = provider.id === editingId;
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        className={cn(
                          'w-full text-left rounded-lg border p-2.5 transition-colors text-xs',
                          'hover:bg-accent/50',
                          isSelected
                            ? 'border-foreground/20 bg-accent/50 shadow-xs'
                            : 'border-border bg-card',
                        )}
                        style={
                          isSelected
                            ? { borderColor: `color-mix(in oklch, ${accentColor} 40%, var(--border))` }
                            : undefined
                        }
                        onClick={() => handleEdit(provider)}
                      >
                        <div className="flex items-center gap-1.5">
                          <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                          <span className="font-medium truncate flex-1">{provider.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                          {provider.model}
                        </div>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {provider.is_default && (
                            <Badge
                              variant="outline"
                              className="h-4 text-xs px-1.5 font-medium gap-0.5"
                              style={{
                                color: accentColor,
                                borderColor: `color-mix(in oklch, ${accentColor} 40%, transparent)`,
                                backgroundColor: `color-mix(in oklch, ${accentColor} 10%, transparent)`,
                              }}
                            >
                              <Star className="h-2.5 w-2.5" aria-hidden="true" />
                              Default
                            </Badge>
                          )}
                          {!provider.is_active && (
                            <Badge
                              variant="outline"
                              className="h-4 text-xs px-1.5 font-medium gap-0.5 text-muted-foreground"
                            >
                              <PowerOff className="h-2.5 w-2.5" aria-hidden="true" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {filteredProviders.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center">
                      <Server className="h-6 w-6 mx-auto text-muted-foreground/40 mb-2" aria-hidden="true" />
                      <p className="text-xs text-muted-foreground">
                        No {activeTab} providers configured
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <Separator orientation="vertical" className="h-auto" />

            {/* Edit Form */}
            <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
              {isEditing ? (
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Name</Label>
                      <Input
                        className="h-9 text-sm"
                        value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="My Provider"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Base URL</Label>
                      <Input
                        className="h-9 text-sm font-mono"
                        value={form.base_url}
                        onChange={(e) => setForm(f => ({ ...f, base_url: e.target.value }))}
                        placeholder="http://127.0.0.1:9100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Endpoint</Label>
                      <Input
                        className="h-9 text-sm font-mono"
                        value={form.endpoint}
                        onChange={(e) => setForm(f => ({ ...f, endpoint: e.target.value }))}
                        placeholder="/v1/images/generations"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Model</Label>
                        <Input
                          className="h-9 text-sm"
                          value={form.model}
                          onChange={(e) => setForm(f => ({ ...f, model: e.target.value }))}
                          placeholder="z-image-turbo"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Timeout (s)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          value={form.timeout_seconds}
                          onChange={(e) => setForm(f => ({ ...f, timeout_seconds: parseInt(e.target.value) || 600 }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">API Key</Label>
                      <Input
                        className="h-9 text-sm font-mono"
                        type="password"
                        value={form.api_key}
                        onChange={(e) => setForm(f => ({ ...f, api_key: e.target.value }))}
                        placeholder="local"
                      />
                    </div>

                    <Separator />

                    {/* Toggles */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between rounded-lg border p-2.5">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={form.is_default}
                            onCheckedChange={(checked) => setForm(f => ({ ...f, is_default: checked }))}
                            aria-label="Set as default provider"
                          />
                          <Label className="text-xs cursor-pointer">Set as Default</Label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-2.5">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={form.is_active}
                            onCheckedChange={(checked) => setForm(f => ({ ...f, is_active: checked }))}
                            aria-label="Toggle provider active status"
                          />
                          <Label className="text-xs cursor-pointer">Active</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Test Connection */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={handleTest}
                        disabled={testing || !form.base_url}
                      >
                        {testing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <TestTube2 className="h-3.5 w-3.5" />
                        )}
                        {testing ? 'Testing...' : 'Test Connection'}
                      </Button>
                      {testResult && (
                        <div
                          className={cn(
                            'flex items-start gap-2 p-2.5 rounded-md border text-xs',
                            testResult.ok
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : 'border-destructive/30 bg-destructive/10 text-destructive'
                          )}
                        >
                          {testResult.ok ? (
                            <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                          )}
                          <span className="break-words">{testResult.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-muted/40">
                    <Server className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No provider selected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a provider from the list or click Add to create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs>

        <DialogFooter className="shrink-0">
          {isEditing && (
            <>
              <Button
                variant="outline"
                className="h-9 text-xs"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              {editingId && !isNew && (
                <Button
                  variant="outline"
                  className="h-9 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteConfirmId(editingId)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              )}
              <Button
                className="h-9 text-xs"
                onClick={handleSave}
                disabled={saving}
                style={{ backgroundColor: accentColor, color: 'white' }}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Provider
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this provider? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
