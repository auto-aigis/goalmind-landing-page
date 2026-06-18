import type {
  User,
  Subscription,
  Goal,
  MicroTask,
  CheckIn,
  WeeklyReport,
  RegisterResponse,
  LoginResponse,
  CheckInRequest,
  CheckInMessageRequest,
  CheckInMessageResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
  CheckoutResponse,
  VerifyTransactionResponse,
  ApiError,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = (await res.json()) as ApiError;
      const d = err.detail;
      if (typeof d === 'string') {
        msg = d;
      } else if (Array.isArray(d)) {
        msg = d.map((e: { msg: string }) => e.msg).join(', ');
      } else if (typeof d === 'object' && d && 'error' in d) {
        msg = (d as { error: string }).error;
      }
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),

  me: () => apiFetch<User>('/api/auth/me'),

  subscription: () => apiFetch<Subscription>('/api/auth/subscription'),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const goalsApi = {
  create: (data: CreateGoalRequest) =>
    apiFetch<Goal>('/api/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: () => apiFetch<Goal[]>('/api/goals'),

  update: (goalId: string, data: UpdateGoalRequest) =>
    apiFetch<{ status: string }>(`/api/goals/${goalId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getMicroTasks: (goalId: string) =>
    apiFetch<MicroTask[]>(`/api/goals/${goalId}/microtasks`),
};

export const checkInsApi = {
  create: (goalId: string) =>
    apiFetch<CheckIn>('/api/checkins', {
      method: 'POST',
      body: JSON.stringify({ goal_id: goalId } as CheckInRequest),
    }),

  sendMessage: (checkinId: string, message: string) =>
    apiFetch<CheckInMessageResponse>(`/api/checkins/${checkinId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message } as CheckInMessageRequest),
    }),

  getHistory: (goalId: string) =>
    apiFetch<CheckIn[]>(`/api/checkins/${goalId}/history`),
};

export const progressApi = {
  get: (goalId: string, demo?: boolean) => {
    const params = demo ? '?demo=true' : '';
    return apiFetch<WeeklyReport>(`/api/progress/${goalId}${params}`);
  },

  generate: (goalId: string) =>
    apiFetch<WeeklyReport>(`/api/progress/${goalId}/generate`, { method: 'POST' }),

  getPdf: (goalId: string) =>
    fetch(`${API_URL}/api/progress/${goalId}/pdf`, { credentials: 'include' }),
};

export const settingsApi = {
  getApiKey: () => apiFetch<{ masked_key: string }>('/api/settings/apikey'),

  saveApiKey: (apiKey: string) =>
    apiFetch<{ status: string }>('/api/settings/apikey', {
      method: 'POST',
      body: new URLSearchParams({ api_key: apiKey }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),

  deleteApiKey: () =>
    apiFetch<{ status: string }>('/api/settings/apikey', { method: 'DELETE' }),

  exportData: () =>
    apiFetch<{ goals: Goal[]; checkins: CheckIn[]; weekly_reports: WeeklyReport[] }>(
      '/api/settings/export'
    ),

  deleteAccount: () =>
    apiFetch<{ status: string }>('/api/settings/account', { method: 'DELETE' }),
};

export const paymentsApi = {
  checkout: (tier: string, billingInterval: string) =>
    apiFetch<CheckoutResponse>('/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  verifyTransaction: (transactionId: string) =>
    apiFetch<VerifyTransactionResponse>('/api/payments/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};