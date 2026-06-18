'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { BarChart2, ArrowLeft, Download, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../_components/AuthProvider';
import { goalsApi, progressApi } from '../../_lib/api';
import type { Goal, WeeklyReport } from '../../_lib/types';

function ProgressContent() {
  const { subscription } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const demo = searchParams.get('demo') === 'true';
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalsApi.list();
        setGoals(data.filter((g) => g.status === 'active'));
        if (data.length > 0) setSelectedGoalId(data[0].id);
      } catch (err) {
        console.error('Failed to load goals:', err);
      }
    };
    fetchGoals();
  }, []);

  useEffect(() => {
    if (!selectedGoalId) return;
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await progressApi.get(selectedGoalId, demo);
        setReport(data);
      } catch (err) {
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedGoalId, demo]);

  const handleGenerate = async () => {
    if (!selectedGoalId) return;
    setGenerating(true);
    try {
      const data = await progressApi.generate(selectedGoalId);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedGoalId) return;
    try {
      const res = await progressApi.getPdf(selectedGoalId);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress-report-${selectedGoalId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const isPaidTier = subscription?.tier === 'coach' || subscription?.tier === 'pro';
  const isProTier = subscription?.tier === 'pro';

  if (!isPaidTier) {
    return (
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">Upgrade Required</h2>
            <p className="text-gray-500 mb-4">
              Weekly progress reports are available for Coach and Pro tiers.
            </p>
            <Button onClick={() => router.push('/pricing')}>View Plans</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Weekly Progress Report</h1>
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : report ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Week of {new Date(report.week_start).toLocaleDateString()}</span>
              {isProTier && (
                <Button size="sm" variant="outline" onClick={handleDownloadPdf}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Check-ins Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{report.checkin_count}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Consistency Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(report.consistency_score * 100)}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Consistency</h3>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${report.consistency_score * 100}%` }}
                />
              </div>
            </div>

            {report.obstacle_summary && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Obstacles Encountered</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {report.obstacle_summary}
                </p>
              </div>
            )}

            {report.coaching_narrative && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Coach&apos;s Note</h3>
                <p className="text-sm text-gray-600 bg-teal-50 p-3 rounded-lg border border-teal-100">
                  {report.coaching_narrative}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No report generated yet for this goal.</p>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Generate Report'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      {isPaidTier && !report && !loading && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => setSelectedGoalId(selectedGoalId)}>
            <BarChart2 className="w-4 h-4 mr-2" />
            Generate New Report
          </Button>
        </div>
      )}
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
      <ProgressContent />
    </Suspense>
  );
}