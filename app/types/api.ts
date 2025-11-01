// API Response Types based on backend analysis

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  error: string | null;
  timestamp: string;
  correlationId: string;
}

export interface ApiError {
  success: false;
  data: null;
  message: string;
  error: string;
  timestamp: string;
  correlationId: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  fido2Assertion?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// Asset Types
export enum AssetType {
  BANK = 'BANK',
  CARD = 'CARD',
  SECURITIES = 'SECURITIES',
  INSURANCE = 'INSURANCE',
  FINTECH = 'FINTECH',
}

export interface Asset {
  id: string;
  assetType: AssetType;
  institutionName: string;
  accountName: string;
  balance: number;
  currentValue: number;
}

export interface CategoryBreakdown {
  assetType: AssetType;
  totalValue: number;
  count: number;
}

export interface AssetSummaryResponse {
  totalBalance: number;
  currency: string;
  assets: Asset[];
  categoryBreakdown: CategoryBreakdown[];
}

// Spending Analysis Types
export interface SpendingCategory {
  category: string;
  amount: number;
  transactionCount: number;
  averageAmount: number;
}

export interface AnomalousTransaction {
  transactionId: string;
  category: string;
  amount: number;
  merchantName: string;
  reason: string;
}

export interface SpendingAnalysisResponse {
  totalSpending: number;
  period: string;
  categoryBreakdown: SpendingCategory[];
  anomalousTransactions: AnomalousTransaction[];
}

// Payment Types
export enum PaymentStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  recipientName: string;
  amount: number;
  description: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  recipientName: string;
  createdAt: string;
  completedAt?: string;
  message: string;
}

// Investment Types
export enum InvestmentType {
  ROUNDUP = 'ROUNDUP',
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

export interface Investment {
  investmentId: string;
  productName: string;
  investmentType: InvestmentType;
  amount: number;
  investedAt: string;
}

export interface InvestmentSummaryResponse {
  totalInvested: number;
  totalRoundedUp: number;
  totalRoundUpTransactions: number;
  recentInvestments: Investment[];
}
