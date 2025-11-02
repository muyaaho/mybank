import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/endpoints';
import { usePaymentStore } from '@/stores/paymentStore';
import { TransferRequest } from '@/types/api';

export const usePaymentHistory = (page = 0, size = 20) => {
  const { setPayments, setLoading, setError } = usePaymentStore();

  return useQuery({
    queryKey: ['payments', page, size],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await paymentApi.getPaymentHistory({ page, size });
        if (response.success) {
          setPayments(response.data);
          return response.data;
        }
        throw new Error(response.error || 'Failed to fetch payment history');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment history';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();
  const { addPayment, setLoading, setError } = usePaymentStore();

  return useMutation({
    mutationFn: (data: TransferRequest) => paymentApi.transfer(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      if (response.success) {
        addPayment(response.data);
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['assets'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      setError(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
