'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Target, Calendar, TrendingUp, Archive, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../_components/AuthProvider';
import { goalsApi } from '../../_lib/api';
import type { Goal } from '../../_lib/types';

export default function GoalsPage() {
  const { subscription } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalsApi.list();
        setGoals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load goals');
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleArchive = async (goalId: string) => {
    try {
      await goalsApi.update(goalId, { status: 'archived' });
      setGoals(goals.map((g) => (g.id === goalId ? { ...g, status: 'archived' } : g)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive goal');
    }
  };

  const activeGoals = goals.filter((g) => g.status === 'active');
  const archivedGoals = goals.filter((g) => g.status === 'archived');
  const tier = subscription?.tier || 'free';
  const goalLimit = tier === 'pro' ? Infinity : tier === 'coach' ? 3 : 1;
  const canCreateMore = activeGoals.length < goalLimit;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Your Goals</h1>
        {canCreateMore ? (
          <Button onClick={() => router.push('/onboarding')}>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        ) : (
          <Badge variant="outline">
            Goal limit reached ({activeGoals.length}/{goalLimit})
          </Badge>
        )}
      </div>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      {activeGoals.length === 0 && archivedGoals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven&apos;t created any goals yet.</p>
            <Button onClick={() => router.push('/onboarding')}>Create Your First Goal</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-gray-500">Active Goals</h2>
              {activeGoals.map((goal) => (
                <Card key={goal.id} className="hover:border-gray-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{goal.goal_name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {goal.goal_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {Math.round(goal.progress * 100)}%
                          </span>
                        </div>
                        <div className="mt-3 h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-teal-600 rounded-full transition-all"
                            style={{ width: `${goal.progress * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link href={`/chat?goal=${goal.id}`}>
                          <Button size="sm">Check-in</Button>
                        </Link>
                        <Button size="sm" variant="ghost" onClick={() => handleArchive(goal.id)}>
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {archivedGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-gray-500">Archived Goals</h2>
              {archivedGoals.map((goal) => (
                <Card key={goal.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{goal.goal_name}</h3>
                        <p className="text-sm text-gray-500">{goal.goal_type}</p>
                      </div>
                      <Badge variant="outline">Archived</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {!canCreateMore && activeGoals.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <p className="text-sm text-amber-700">
              You&apos;ve reached your goal limit for the {tier} tier. Upgrade to create more goals.
            </p>
            <Link href="/pricing" className="mt-2 block">
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-700">
                View Upgrade Options
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}