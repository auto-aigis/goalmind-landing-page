'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, GraduationCap, Dumbbell, Briefcase, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { goalsApi } from '../../_lib/api';
import type { GoalType } from '../../_lib/types';

const goalTypes: { value: GoalType; label: string; icon: typeof GraduationCap }[] = [
  { value: 'Exam Prep', label: 'Exam Prep', icon: GraduationCap },
  { value: 'Fitness', label: 'Fitness', icon: Dumbbell },
  { value: 'Career', label: 'Career', icon: Briefcase },
  { value: 'Habit Formation', label: 'Habit Formation', icon: Leaf },
];

const steps = ['goal-type', 'goal-details', 'target-date', 'success-description'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    goalType: '' as GoalType | '',
    goalName: '',
    targetDate: '',
    successDescription: '',
  });

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.goalType || !formData.goalName || !formData.targetDate) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await goalsApi.create({
        goal_type: formData.goalType as GoalType,
        goal_name: formData.goalName,
        target_date: formData.targetDate,
        success_description: formData.successDescription || null,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                idx <= step
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {idx < step ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 0 && 'What type of goal are you working on?'}
            {step === 1 && 'Name your goal'}
            {step === 2 && 'When do you want to achieve this?'}
            {step === 3 && 'What does success look like?'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
          )}

          {step === 0 && (
            <RadioGroup
              value={formData.goalType}
              onValueChange={(v) => setFormData({ ...formData, goalType: v as GoalType })}
              className="grid gap-3"
            >
              {goalTypes.map((gt) => {
                const Icon = gt.icon;
                return (
                  <label
                    key={gt.value}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.goalType === gt.value
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <RadioGroupItem value={gt.value} />
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">{gt.label}</span>
                  </label>
                );
              })}
            </RadioGroup>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                placeholder="e.g., Run a half marathon"
                value={formData.goalName}
                onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <Label htmlFor="successDescription">Success Description (optional)</Label>
              <Textarea
                id="successDescription"
                placeholder="Describe what achieving this goal would look like..."
                rows={4}
                value={formData.successDescription}
                onChange={(e) => setFormData({ ...formData, successDescription: e.target.value })}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext} className="flex-1">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}