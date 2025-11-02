'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAssets } from '@/lib/hooks/useAssets';
import { useTransfer, usePaymentHistory } from '@/lib/hooks/usePayments';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { PaymentStatus } from '@/types/api';

const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Please select an account'),
  toAccountId: z.string().min(1, 'Recipient account is required'),
  recipientName: z.string().min(2, 'Recipient name is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  description: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

const STATUS_COLORS: Record<PaymentStatus, string> = {
  COMPLETED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function PaymentPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: paymentHistory, isLoading: historyLoading } = usePaymentHistory(0, 10);
  const transferMutation = useTransfer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const onSubmit = async (data: TransferFormData) => {
    transferMutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
        reset();
        setTimeout(() => setShowSuccess(false), 3000);
      },
    });
  };

  if (assetsLoading || historyLoading) {
    return <Loading message="Loading payment page..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">Transfer money between accounts</p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Transfer completed successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="New Transfer" description="Send money to another account">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Account
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register('fromAccountId')}
              >
                <option value="">Select account</option>
                {assets?.assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.accountName} - {formatCurrency(asset.balance)}
                  </option>
                ))}
              </select>
              {errors.fromAccountId && (
                <p className="mt-1 text-sm text-red-600">{errors.fromAccountId.message}</p>
              )}
            </div>

            <Input
              label="Recipient Account Number"
              placeholder="Enter account number"
              error={errors.toAccountId?.message}
              {...register('toAccountId')}
            />

            <Input
              label="Recipient Name"
              placeholder="Enter recipient name"
              error={errors.recipientName?.message}
              {...register('recipientName')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <Input
              label="Description (Optional)"
              placeholder="What's this for?"
              {...register('description')}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={transferMutation.isPending}
            >
              Transfer Money
            </Button>
          </form>
        </Card>

        <Card title="Recent Payments" description="Your latest transactions">
          {paymentHistory && paymentHistory.payments.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.payments.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.recipientName}
                      </p>
                      <p className="text-sm text-gray-600">{payment.message}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[payment.status]}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(new Date(payment.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No payment history</p>
          )}
        </Card>
      </div>
    </div>
  );
}
