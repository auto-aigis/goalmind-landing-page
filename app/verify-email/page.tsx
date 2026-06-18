'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authApi } from '../_lib/api';
import { useAuth } from '../_components/AuthProvider';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          await authApi.verifyEmail(token);
          setStatus('success');
          setMessage('Email verified successfully!');
          await refresh();
          setTimeout(() => router.push('/dashboard'), 1500);
        } catch (err) {
          setStatus('error');
          setMessage(err instanceof Error ? err.message : 'Verification failed');
        }
      };
      verify();
    } else if (emailParam) {
      setStatus('pending');
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token, emailParam, router, refresh]);

  const handleResend = async () => {
    if (!emailParam) return;
    setResending(true);
    try {
      await authApi.resendVerification(emailParam);
      setMessage('Verification email sent! Check your inbox.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="py-8">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium mb-4">{message}</p>
              <Link href="/login">
                <Button variant="outline">Back to Login</Button>
              </Link>
            </div>
          )}

          {status === 'pending' && (
            <div className="py-8">
              <Mail className="w-10 h-10 text-teal-600 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">Check your inbox</p>
              <p className="text-sm text-gray-500 mb-4">
                We sent a verification link to <span className="font-medium">{emailParam}</span>
              </p>
              {message && (
                <p className="text-sm text-green-600 mb-4">{message}</p>
              )}
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resending}
                className="w-full"
              >
                {resending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Resend Verification Email
              </Button>
              <div className="mt-4">
                <Link href="/login" className="text-sm text-teal-600 hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}