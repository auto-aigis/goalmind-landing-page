'use client';

import { useAuth } from '../_components/AuthProvider';

export { useAuth };

export function useCheckInLimit() {
  const { subscription } = useAuth();
  const tier = subscription?.tier || 'free';
  return {
    limit: tier === 'free' ? 2 : Infinity,
    isLimited: tier === 'free',
    isPaid: tier !== 'free',
  };
}