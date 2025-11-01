'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { pfmApi } from '@/lib/api/endpoints';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, TrendingDown } from 'lucide-react';

export default function SpendingPage() {
  const [daysBack, setDaysBack] = useState(30);

  const { data: spending, isLoading, error } = useQuery({
    queryKey: ['spending', daysBack],
    queryFn: async () => {
      const response = await pfmApi.getSpendingAnalysis(daysBack);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        지출 분석 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const chartData = spending?.categoryBreakdown.map((item) => ({
    category: getCategoryName(item.category),
    amount: item.amount,
    count: item.transactionCount,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">지출 분석</h1>
          <p className="text-gray-600 mt-2">최근 {daysBack}일간의 지출 내역</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={daysBack === 7 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setDaysBack(7)}
          >
            7일
          </Button>
          <Button
            variant={daysBack === 30 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setDaysBack(30)}
          >
            30일
          </Button>
          <Button
            variant={daysBack === 90 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setDaysBack(90)}
          >
            90일
          </Button>
        </div>
      </div>

      {/* Total Spending */}
      <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm">총 지출</p>
            <h2 className="text-4xl font-bold mt-2">
              {formatCurrency(spending?.totalSpending || 0)}
            </h2>
            <p className="text-red-100 text-sm mt-2">{spending?.period}</p>
          </div>
          <TrendingDown className="w-16 h-16 opacity-50" />
        </div>
      </Card>

      {/* Spending Chart */}
      <Card title="카테고리별 지출">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `카테고리: ${label}`}
            />
            <Legend />
            <Bar dataKey="amount" fill="#ef4444" name="지출 금액" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Breakdown */}
      <Card title="카테고리별 상세">
        <div className="space-y-3">
          {spending?.categoryBreakdown.map((category) => (
            <div
              key={category.category}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{getCategoryName(category.category)}</p>
                <p className="text-sm text-gray-500">
                  {category.transactionCount}건 • 평균 {formatCurrency(category.averageAmount)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(category.amount)}
                </p>
                <p className="text-xs text-gray-500">
                  {((category.amount / (spending?.totalSpending || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}

          {(!spending?.categoryBreakdown || spending.categoryBreakdown.length === 0) && (
            <p className="text-center text-gray-500 py-8">지출 내역이 없습니다.</p>
          )}
        </div>
      </Card>

      {/* Anomalous Transactions */}
      {spending?.anomalousTransactions && spending.anomalousTransactions.length > 0 && (
        <Card title="이상 거래 감지">
          <div className="space-y-3">
            {spending.anomalousTransactions.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="flex items-start p-4 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.merchantName}</p>
                      <p className="text-sm text-gray-600 mt-1">{getCategoryName(transaction.category)}</p>
                    </div>
                    <p className="font-semibold text-amber-700">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-amber-700 bg-amber-100 px-3 py-2 rounded">
                    {transaction.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    FOOD: '식비',
    SHOPPING: '쇼핑',
    TRANSPORT: '교통',
    ENTERTAINMENT: '엔터테인먼트',
    UTILITY: '공과금',
    HEALTHCARE: '의료',
    EDUCATION: '교육',
    TRANSFER: '송금',
    OTHER: '기타',
  };
  return names[category] || category;
}
