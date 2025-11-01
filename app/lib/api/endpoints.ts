import { apiClient } from './client';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AssetSummaryResponse,
  SpendingAnalysisResponse,
  TransferRequest,
  PaymentResponse,
  InvestmentSummaryResponse,
} from '@/types/api';

// Authentication endpoints
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/api/v1/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<LoginResponse>('/api/v1/auth/register', data),

  logout: () =>
    apiClient.post('/api/v1/auth/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/api/v1/auth/refresh', { refreshToken }),
};

// PFM endpoints
export const pfmApi = {
  getAssets: () =>
    apiClient.get<AssetSummaryResponse>('/api/v1/pfm/assets'),

  getSpendingAnalysis: (daysBack = 30) =>
    apiClient.get<SpendingAnalysisResponse>(`/api/v1/pfm/spending/analysis?daysBack=${daysBack}`),
};

// Payment endpoints
export const paymentApi = {
  transfer: (data: TransferRequest) =>
    apiClient.post<PaymentResponse>('/api/v1/payment/transfer', data),

  getPayment: (paymentId: string) =>
    apiClient.get<PaymentResponse>(`/api/v1/payment/${paymentId}`),
};

// Investment endpoints
export const investmentApi = {
  getSummary: () =>
    apiClient.get<InvestmentSummaryResponse>('/api/v1/invest/summary'),
};
