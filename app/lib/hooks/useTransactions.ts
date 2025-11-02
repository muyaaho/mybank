import { useQuery } from '@tanstack/react-query';
import { pfmApi } from '../api/endpoints';
import { useTransactionStore } from '@/stores/transactionStore';

export const useTransactions = (page = 0, size = 20, accountId?: string) => {
  const { setTransactions, setLoading, setError, setCurrentPage } = useTransactionStore();

  return useQuery({
    queryKey: ['transactions', page, size, accountId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await pfmApi.getTransactions({ page, size, accountId });
        if (response.success) {
          setTransactions(response.data);
          setCurrentPage(page);
          return response.data;
        }
        throw new Error(response.error || 'Failed to fetch transactions');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
