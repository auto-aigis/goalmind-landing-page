export type GoalType = 'Exam Prep' | 'Fitness' | 'Career' | 'Habit Formation';
export type GoalStatus = 'active' | 'archived';
export type Tier = 'free' | 'coach' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  tier: Tier;
  is_email_verified: boolean;
  created_at: string;
}

export interface Subscription {
  tier: Tier;
  status: SubscriptionStatus;
  current_period_end: string | null;
  price_id: string | null;
}

export interface Goal {
  id: string;
  user_id: string;
  goal_type: GoalType;
  goal_name: string;
  target_date: string;
  success_description: string | null;
  status: GoalStatus;
  created_at: string;
  progress: number;
}

export interface MicroTask {
  id: string;
  goal_id: string;
  week_number: number;
  description: string;
  is_completed: boolean;
  created_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface CheckIn {
  id: string;
  goal_id: string;
  conversation_history: Message[];
  week_number: number | null;
  created_at: string;
}

export interface WeeklyReport {
  id: string;
  goal_id: string;
  week_start: string;
  checkin_count: number;
  consistency_score: number;
  obstacle_summary: string | null;
  coaching_narrative: string | null;
  created_at: string;
}

export interface ApiError {
  detail: string | { msg: string; loc: string[] }[];
}

export interface RegisterResponse {
  status: string;
  email: string;
}

export interface LoginResponse extends User {}

export interface CheckInRequest {
  goal_id: string;
}

export interface CheckInMessageRequest {
  message: string;
}

export interface CheckInMessageResponse {
  response: string;
  checkin_id: string;
  done: boolean;
}

export interface CreateGoalRequest {
  goal_type: GoalType;
  goal_name: string;
  target_date: string;
  success_description: string | null;
}

export interface UpdateGoalRequest {
  goal_name?: string;
  status?: GoalStatus;
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}

export interface VerifyTransactionResponse {
  status: string;
  tier: Tier;
}