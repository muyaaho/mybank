'use client';

import { useState } from 'react';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { TransactionType } from '@/types/api';

const TRANSACTION_ICONS: Record<TransactionType, string> = {
  DEPOSIT: '↓',
  WITHDRAWAL: '↑',
  TRANSFER: '→',
  PAYMENT: '→',
};

const TRANSACTION_COLORS: Record<TransactionType, string> = {
  DEPOSIT: 'text-green-600 bg-green-100',
  WITHDRAWAL: 'text-red-600 bg-red-100',
  TRANSFER: 'text-blue-600 bg-blue-100',
  PAYMENT: 'text-purple-600 bg-purple-100',
};

export default function AccountsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useTransactions(page, 20);

  if (isLoading) {
    return <Loading message="Loading transactions..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-2">View your transaction history</p>
      </div>

      <Card title="Transaction History">
        {data && data.transactions.length > 0 ? (
          <>
            <div className="space-y-3">
              {data.transactions.map((transaction) => (
                <div
                  key={transaction.transactionId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${TRANSACTION_COLORS[transaction.type]}`}>
                      <span className="text-lg font-bold">
                        {TRANSACTION_ICONS[transaction.type]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.merchantName || transaction.category}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(new Date(transaction.transactionDate))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance: {formatCurrency(transaction.balance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-12">No transactions found</p>
        )}
      </Card>
    </div>
  );
}
