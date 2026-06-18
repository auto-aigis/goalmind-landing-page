'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Key, Download, Trash2, CreditCard, Loader2, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../_components/AuthProvider';
import { settingsApi } from '../../_lib/api';

export default function SettingsPage() {
  const { user, subscription, logout, refresh } = useAuth();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [loadingKey, setLoadingKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'saved' | 'deleted'>('idle');
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaskedKey = async () => {
      try {
        const data = await settingsApi.getApiKey();
        setMaskedKey(data.masked_key);
      } catch {
        setMaskedKey('');
      }
    };
    fetchMaskedKey();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setSavingKey(true);
    setError('');
    try {
      await settingsApi.saveApiKey(apiKey);
      setKeyStatus('saved');
      setApiKey('');
      setMaskedKey('sk-...****');
      setTimeout(() => setKeyStatus('idle'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setSavingKey(false);
    }
  };

  const handleDeleteApiKey = async () => {
    setLoadingKey(true);
    try {
      await settingsApi.deleteApiKey();
      setKeyStatus('deleted');
      setMaskedKey('');
      setTimeout(() => setKeyStatus('idle'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
    } finally {
      setLoadingKey(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await settingsApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'goalmind-data-export.json';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    if (!confirm('This will permanently delete all your data including goals, check-ins, and progress reports.')) {
      return;
    }
    setDeleting(true);
    try {
      await settingsApi.deleteAccount();
      await logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
    }
  };

  const tier = subscription?.tier || 'free';
  const isPaid = tier !== 'free';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <Badge variant={isPaid ? 'default' : 'secondary'}>
              {tier === 'pro' ? 'Pro' : tier === 'coach' ? 'Coach' : 'Free'}
            </Badge>
          </div>
          {subscription?.current_period_end && (
            <div>
              <p className="text-sm font-medium text-gray-900">Current Period Ends</p>
              <p className="text-sm text-gray-500">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          {isPaid ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                You&apos;re on the {tier} plan{}
                {subscription?.current_period_end &&
                  `. Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
              </p>
              <Button variant="outline" size="sm" onClick={() => router.push('/pricing')}>
                Manage
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Upgrade to unlock more features</p>
              <Button onClick={() => router.push('/pricing')}>View Plans</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenAI API Key
          </CardTitle>
          <CardDescription>
            Use your own OpenAI API key (optional). This overrides the default model for your tier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {maskedKey && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-600" />
              Saved: {maskedKey}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="apiKey">Your OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} disabled={savingKey || !apiKey.trim()}>
              {savingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Key'}
            </Button>
            {maskedKey && (
              <Button variant="outline" onClick={handleDeleteApiKey} disabled={loadingKey}>
                {loadingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove Key'}
              </Button>
            )}
          </div>
          {keyStatus === 'saved' && (
            <p className="text-sm text-green-600">API key saved successfully</p>
          )}
          {keyStatus === 'deleted' && (
            <p className="text-sm text-gray-600">API key removed</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Export
          </CardTitle>
          <CardDescription>Download all your data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Export Data
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}