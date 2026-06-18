'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Target, MessageCircle, TrendingUp, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../_components/AuthProvider';
import { goalsApi, checkInsApi, progressApi, paymentsApi } from '../../_lib/api';
import type { Goal, CheckIn } from '../../_lib/types';

function DashboardContent() {
  const { user, subscription } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const checkoutSuccess = searchParams.get('checkout') === 'success';
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalsApi.list();
        setGoals(data);
      } catch (err) {
        console.error('Failed to load goals:', err);
      }
    };
    fetchGoals();
  }, []);

  useEffect(() => {
    const handlePaymentVerification = async () => {
      if (checkoutSuccess && transactionId) {
        setProcessingPayment(true);
        try {
          const result = await paymentsApi.verifyTransaction(transactionId);
          if (result.status === 'active') {
            const params = new URLSearchParams(window.location.search);
            params.delete('checkout');
            params.delete('transaction_id');
            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
          }
        } catch (err) {
          console.error('Payment verification failed:', err);
        } finally {
          setProcessingPayment(false);
        }
      }
    };
    handlePaymentVerification();
  }, [checkoutSuccess, transactionId]);

  useEffect(() => {
    if (!loading && goals.length === 0) {
      router.push('/onboarding');
    }
  }, [loading, goals, router]);

  const activeGoal = goals.find((g) => g.status === 'active');
  const isPaidTier = subscription?.tier === 'coach' || subscription?.tier === 'pro';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {processingPayment && (
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-teal-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing payment... please wait.</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back{user?.display_name ? `, ${user.display_name}` : ''}
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s your goal progress</p>
        </div>
        {!isPaidTier && (
          <Link href="/pricing">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Upgrade to Pro
            </Badge>
          </Link>
        )}
      </div>

      {activeGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Today&apos;s Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{activeGoal.goal_name}</p>
              <p className="text-sm text-gray-500 capitalize">{activeGoal.goal_type.toLowerCase()}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/chat" className="flex-1">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Check-in
                </Button>
              </Link>
              {isPaidTier && (
                <Link href="/progress">
                  <Button variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <ul className="space-y-3">
                {goals.slice(0, 3).map((goal) => (
                  <li key={goal.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{goal.goal_name}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round(goal.progress * 100)}% complete
                      </p>
                    </div>
                    <div className="w-24 h-2 bg-gray-100 rounded-full ml-3">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${goal.progress * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No goals yet</p>
            )}
            <Link href="/goals" className="block mt-4">
              <Button variant="ghost" size="sm" className="w-full">
                View all goals
              </Button>
            </Link>
          </CardContent>
        </Card>

        {isPaidTier ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Your weekly progress report is available</span>
              </div>
              <Link href="/progress">
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  View Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
                <span>Upgrade to Coach or Pro to unlock weekly progress reports</span>
              </div>
              <Link href="/pricing">
                <Button size="sm" className="w-full">
                  See Pricing
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Current Plan</span>
            <Badge variant={isPaidTier ? 'default' : 'secondary'}>
              {subscription?.tier === 'pro'
                ? 'Pro'
                : subscription?.tier === 'coach'
                ? 'Coach'
                : 'Free'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}