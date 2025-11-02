import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentApi } from '../api/endpoints';
import { useInvestmentStore } from '@/stores/investmentStore';

export const useInvestmentSummary = () => {
  const { setSummary, setLoading, setError } = useInvestmentStore();

  return useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await investmentApi.getSummary();
        if (response.success) {
          setSummary(response.data);
          return response.data;
        }
        throw new Error(response.error || 'Failed to fetch investment summary');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch investment summary';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoundUpToggle = () => {
  const queryClient = useQueryClient();
  const { setRoundUpEnabled } = useInvestmentStore();

  const enableMutation = useMutation({
    mutationFn: (accountId: string) => investmentApi.enableRoundUp(accountId),
    onSuccess: () => {
      setRoundUpEnabled(true);
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });

  const disableMutation = useMutation({
    mutationFn: (accountId: string) => investmentApi.disableRoundUp(accountId),
    onSuccess: () => {
      setRoundUpEnabled(false);
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });

  return {
    enableRoundUp: enableMutation.mutate,
    disableRoundUp: disableMutation.mutate,
    isLoading: enableMutation.isPending || disableMutation.isPending,
  };
};
