'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '../../_components/AuthProvider';
import { goalsApi, checkInsApi } from '../../_lib/api';
import type { Goal, Message, CheckIn } from '../../_lib/types';

export default function ChatPage() {
  const { subscription } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(searchParams.get('goal'));
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalsApi.list();
        setGoals(data.filter((g) => g.status === 'active'));
        if (!selectedGoalId && data.length > 0) {
          setSelectedGoalId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load goals:', err);
      }
    };
    fetchGoals();
  }, [selectedGoalId]);

  useEffect(() => {
    if (!selectedGoalId) return;
    const fetchHistory = async () => {
      try {
        const history = await checkInsApi.getHistory(selectedGoalId);
        if (history.length > 0) {
          const lastCheckIn = history[history.length - 1];
          setCheckIn(lastCheckIn);
          setMessages(lastCheckIn.conversation_history || []);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    fetchHistory();
  }, [selectedGoalId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartCheckIn = async () => {
    if (!selectedGoalId) return;
    setLoading(true);
    setError('');
    try {
      const newCheckIn = await checkInsApi.create(selectedGoalId);
      setCheckIn(newCheckIn);
      const welcomeMsg: Message = {
        role: 'assistant',
        content:
          "Good to see you! Let's check in on your progress. How did things go since our last conversation?",
      };
      setMessages([welcomeMsg]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('limit') || msg.includes('403')) {
        setLimitReached(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !checkIn) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const response = await checkInsApi.sendMessage(checkIn.id, userMsg.content);
      const assistantMsg: Message = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('limit') || msg.includes('403')) {
        setLimitReached(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);
  const isPaidTier = subscription?.tier !== 'free';

  if (goals.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <p className="text-gray-500 mb-4">You don't have any active goals yet.</p>
        <Button onClick={() => router.push('/onboarding')}>Create Your First Goal</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Daily Check-in</h1>
      </div>

      {goals.length > 1 && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Select Goal</label>
          <div className="flex gap-2 flex-wrap">
            {goals.map((goal) => (
              <Badge
                key={goal.id}
                variant={selectedGoalId === goal.id ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedGoalId(goal.id)}
              >
                {goal.goal_name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {limitReached ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">Check-in Limit Reached</h2>
            <p className="text-gray-500 mb-4">
              Free tier users get 2 AI check-ins per week. Upgrade to unlock unlimited daily check-ins.
            </p>
            <Button onClick={() => router.push('/pricing')}>View Plans</Button>
          </CardContent>
        </Card>
      ) : checkIn && messages.length > 0 ? (
        <Card>
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Type your message..."
                disabled={loading}
              />
              <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">
              Ready to check in on your{' '}
              <span className="font-medium text-gray-900">{selectedGoal?.goal_name}</span> goal?
            </p>
            <Button onClick={handleStartCheckIn} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Start Check-in
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
      )}
    </div>
  );
}