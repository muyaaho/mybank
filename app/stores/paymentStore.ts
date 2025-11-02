import { create } from 'zustand';
import { PaymentResponse } from '@/types/api';

interface PaymentState {
  payments: PaymentResponse[];
  currentPayment: PaymentResponse | null;
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  error: string | null;
  setPayments: (data: { payments: PaymentResponse[]; totalPages: number; totalElements: number }) => void;
  setCurrentPayment: (payment: PaymentResponse | null) => void;
  addPayment: (payment: PaymentResponse) => void;
  clearPayments: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  currentPayment: null,
  totalPages: 0,
  totalElements: 0,
  isLoading: false,
  error: null,
  setPayments: (data) =>
    set({
      payments: data.payments,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      error: null,
    }),
  setCurrentPayment: (payment) => set({ currentPayment: payment }),
  addPayment: (payment) =>
    set((state) => ({
      payments: [payment, ...state.payments],
      currentPayment: payment,
    })),
  clearPayments: () =>
    set({
      payments: [],
      currentPayment: null,
      totalPages: 0,
      totalElements: 0,
      error: null,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
