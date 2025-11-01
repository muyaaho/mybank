'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { paymentApi } from '@/lib/api/endpoints';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import { PaymentResponse } from '@/types/api';

const transferSchema = z.object({
  fromAccountId: z.string().min(1, '출금 계좌를 입력하세요'),
  toAccountId: z.string().min(1, '입금 계좌를 입력하세요'),
  recipientName: z.string().min(1, '받는 분 성함을 입력하세요'),
  amount: z.number().min(1, '송금 금액을 입력하세요').positive('양수를 입력하세요'),
  description: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function PaymentPage() {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const transferMutation = useMutation({
    mutationFn: paymentApi.transfer,
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        setError('');
        reset();
        // Invalidate assets query to refresh balance
        queryClient.invalidateQueries({ queryKey: ['assets'] });
      } else {
        setError(data.message || '송금에 실패했습니다');
        setResult(null);
      }
    },
    onError: (err: any) => {
      console.error('Transfer error:', err);
      setError(err.response?.data?.message || '송금 중 오류가 발생했습니다');
      setResult(null);
    },
  });

  const onSubmit = (data: TransferFormData) => {
    setResult(null);
    setError('');
    transferMutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">송금</h1>
        <p className="text-gray-600 mt-2">계좌 이체 서비스</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Form */}
        <Card title="송금하기">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="출금 계좌 ID"
              placeholder="account-123"
              error={errors.fromAccountId?.message}
              {...register('fromAccountId')}
            />

            <Input
              label="입금 계좌 ID"
              placeholder="account-456"
              error={errors.toAccountId?.message}
              {...register('toAccountId')}
            />

            <Input
              label="받는 분"
              placeholder="홍길동"
              error={errors.recipientName?.message}
              {...register('recipientName')}
            />

            <Input
              label="송금 금액 (원)"
              type="number"
              placeholder="100000"
              error={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />

            <Input
              label="메모 (선택)"
              placeholder="월세"
              {...register('description')}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={transferMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              송금하기
            </Button>
          </form>
        </Card>

        {/* Result Display */}
        <div className="space-y-6">
          {/* Success Result */}
          {result && result.status === 'COMPLETED' && (
            <Card className="bg-green-50 border-2 border-green-200">
              <div className="flex items-start">
                <CheckCircle className="w-12 h-12 text-green-600 mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">
                    송금 완료
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-green-200">
                      <span className="text-green-700">받는 분</span>
                      <span className="font-semibold text-green-900">
                        {result.recipientName}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-200">
                      <span className="text-green-700">송금 금액</span>
                      <span className="font-semibold text-green-900">
                        {formatCurrency(result.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-200">
                      <span className="text-green-700">거래 번호</span>
                      <span className="font-mono text-sm text-green-800">
                        {result.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-green-700">완료 시각</span>
                      <span className="text-green-800">
                        {result.completedAt && formatDateTime(result.completedAt)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
                    {result.message}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Pending Result */}
          {result && result.status === 'PENDING' && (
            <Card className="bg-yellow-50 border-2 border-yellow-200">
              <div className="flex items-start">
                <div className="w-12 h-12 mr-4 flex-shrink-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    송금 처리 중
                  </h3>
                  <p className="text-yellow-700">{result.message}</p>
                  <p className="text-sm text-yellow-600 mt-2">거래 번호: {result.paymentId}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Error Result */}
          {(error || (result && result.status === 'FAILED')) && (
            <Card className="bg-red-50 border-2 border-red-200">
              <div className="flex items-start">
                <XCircle className="w-12 h-12 text-red-600 mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    송금 실패
                  </h3>
                  <p className="text-red-700">{error || result?.message}</p>
                  {result && (
                    <p className="text-sm text-red-600 mt-2">거래 번호: {result.paymentId}</p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Info Card */}
          {!result && !error && (
            <Card title="송금 안내">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <p>계좌 ID는 대시보드의 자산 목록에서 확인할 수 있습니다.</p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <p>송금 금액은 원 단위로 입력해주세요.</p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    라운드업 투자가 활성화되어 있다면, 송금 금액이 자동으로 라운드업되어
                    투자될 수 있습니다.
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <p>송금은 즉시 처리되며, 거래 내역은 지출 분석에 반영됩니다.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
