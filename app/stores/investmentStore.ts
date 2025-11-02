import { create } from 'zustand';
import { Investment, InvestmentSummaryResponse } from '@/types/api';

interface InvestmentState {
  totalInvested: number;
  totalRoundedUp: number;
  totalRoundUpTransactions: number;
  recentInvestments: Investment[];
  roundUpEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  setSummary: (data: InvestmentSummaryResponse) => void;
  setRoundUpEnabled: (enabled: boolean) => void;
  clearInvestments: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  totalInvested: 0,
  totalRoundedUp: 0,
  totalRoundUpTransactions: 0,
  recentInvestments: [],
  roundUpEnabled: false,
  isLoading: false,
  error: null,
  setSummary: (data) =>
    set({
      totalInvested: data.totalInvested,
      totalRoundedUp: data.totalRoundedUp,
      totalRoundUpTransactions: data.totalRoundUpTransactions,
      recentInvestments: data.recentInvestments,
      error: null,
    }),
  setRoundUpEnabled: (enabled) => set({ roundUpEnabled: enabled }),
  clearInvestments: () =>
    set({
      totalInvested: 0,
      totalRoundedUp: 0,
      totalRoundUpTransactions: 0,
      recentInvestments: [],
      roundUpEnabled: false,
      error: null,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
