'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../_components/AuthProvider';
import { paymentsApi } from '../../_lib/api';

declare global {
  interface Window {
    Paddle?: {
      Initialize: (options: { token: string; eventCallback?: (event: Record<string, unknown>) => void }) => void;
      Checkout: {
        open: (options: {
          items: { priceId: string; quantity: number }[];
          customData?: Record<string, unknown>;
          settings?: { displayMode: string };
        }) => void;
        close: () => void;
      };
    };
  }
}

const tiers = [
  {
    name: 'Free',
    id: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Get started with basic goal tracking',
    features: [
      '2 AI check-ins per week',
      '1 active goal',
      'Basic goal tracking dashboard',
      'GPT-4o-mini for AI chat',
    ],
    cta: 'Current Plan',
    highlighted: false,
  },
  {
    name: 'Coach',
    id: 'coach',
    monthlyPrice: 4,
    yearlyPrice: 32,
    description: 'For emerging markets — daily coaching focus',
    features: [
      'Unlimited daily AI check-ins',
      'Up to 3 active goals',
      'Weekly visual progress reports',
      'Obstacle history log',
      'Email support',
      'GPT-4o-mini for AI chat',
    ],
    cta: 'Get Coach',
    highlighted: true,
  },
  {
    name: 'Pro',
    id: 'pro',
    monthlyPrice: 12,
    yearlyPrice: 96,
    description: 'For power users — full feature access',
    features: [
      'Everything in Coach',
      'Unlimited active goals',
      'GPT-4o full model for AI',
      'Downloadable PDF reports',
      'Early access to new features',
      'Priority support',
    ],
    cta: 'Get Pro',
    highlighted: false,
  },
];

export default function PricingPage() {
  const { user, subscription, refresh } = useAuth();
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (paddleToken && window.Paddle) {
      window.Paddle.Initialize({
        token: paddleToken,
        eventCallback: (event: Record<string, unknown>) => {
          const e = event as { name?: string; data?: { transaction_id?: string } };
          if (e.name === 'checkout.completed') {
            const txnId = e.data?.transaction_id || '';
            window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
          }
        },
      });
    }
  }, []);

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (tierId === 'free') return;

    setLoading(tierId);
    setError('');
    try {
      const { price_id } = await paymentsApi.checkout(tierId, billingInterval);
      if (window.Paddle) {
        window.Paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: 'overlay' },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(null);
    }
  };

  const currentTier = subscription?.tier || 'free';

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-500">Select the plan that works best for your goals</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingInterval === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingInterval === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">
              ~33% off
            </Badge>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => {
          const price = billingInterval === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
          const isCurrentTier = currentTier === tier.id;
          const isLoading = loading === tier.id;

          return (
            <Card
              key={tier.id}
              className={`relative ${
                tier.highlighted ? 'border-teal-600 border-2 shadow-lg' : 'border-gray-200'
              }`}
            >
              {tier.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-500">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.highlighted ? 'default' : 'outline'}
                  disabled={isCurrentTier || isLoading || tier.id === 'free'}
                  onClick={() => handleSubscribe(tier.id)}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrentTier ? (
                    'Current Plan'
                  ) : (
                    tier.cta
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}