import { create } from 'zustand';
import { Transaction } from '@/types/api';

interface TransactionState {
  transactions: Transaction[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  setTransactions: (data: { transactions: Transaction[]; totalPages: number; totalElements: number }) => void;
  addTransactions: (transactions: Transaction[]) => void;
  setCurrentPage: (page: number) => void;
  clearTransactions: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  isLoading: false,
  error: null,
  setTransactions: (data) =>
    set({
      transactions: data.transactions,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      error: null,
    }),
  addTransactions: (transactions) =>
    set((state) => ({
      transactions: [...state.transactions, ...transactions],
    })),
  setCurrentPage: (page) => set({ currentPage: page }),
  clearTransactions: () =>
    set({
      transactions: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
      error: null,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
