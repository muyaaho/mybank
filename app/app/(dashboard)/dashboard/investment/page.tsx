'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { investmentApi } from '@/lib/api/endpoints';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { TrendingUp, PiggyBank, Zap } from 'lucide-react';
import { InvestmentType } from '@/types/api';

const INVESTMENT_TYPE_ICONS = {
  ROUNDUP: Zap,
  MANUAL: TrendingUp,
  AUTO: PiggyBank,
};

const INVESTMENT_TYPE_COLORS = {
  ROUNDUP: 'bg-purple-100 text-purple-700',
  MANUAL: 'bg-blue-100 text-blue-700',
  AUTO: 'bg-green-100 text-green-700',
};

export default function InvestmentPage() {
  const { data: investment, isLoading, error } = useQuery({
    queryKey: ['investment'],
    queryFn: async () => {
      const response = await investmentApi.getSummary();
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
        투자 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">투자</h1>
        <p className="text-gray-600 mt-2">자동 투자 및 라운드업 투자 현황</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">총 투자 금액</p>
              <h2 className="text-3xl font-bold mt-2">
                {formatCurrency(investment?.totalInvested || 0)}
              </h2>
            </div>
            <TrendingUp className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">라운드업 투자</p>
              <h2 className="text-3xl font-bold mt-2">
                {formatCurrency(investment?.totalRoundedUp || 0)}
              </h2>
            </div>
            <Zap className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">라운드업 횟수</p>
              <h2 className="text-3xl font-bold mt-2">
                {investment?.totalRoundUpTransactions || 0}건
              </h2>
            </div>
            <PiggyBank className="w-12 h-12 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Round-up Info */}
      <Card title="라운드업 투자란?" description="결제 금액을 반올림하여 자동으로 투자하는 서비스입니다">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            예를 들어, 15,300원을 결제하면 200원이 자동으로 투자됩니다 (15,500원으로 라운드업).
            작은 금액도 모이면 큰 투자가 됩니다!
          </p>
          {investment && investment.totalRoundUpTransactions > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">평균 라운드업 금액</p>
                <p className="text-lg font-semibold text-purple-700">
                  {formatCurrency((investment.totalRoundedUp / investment.totalRoundUpTransactions) || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">총 라운드업 비율</p>
                <p className="text-lg font-semibold text-purple-700">
                  {((investment.totalRoundedUp / investment.totalInvested) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Investments */}
      <Card title="최근 투자 내역">
        <div className="space-y-3">
          {investment?.recentInvestments.map((item) => {
            const Icon = INVESTMENT_TYPE_ICONS[item.investmentType as keyof typeof INVESTMENT_TYPE_ICONS];
            const colorClass = INVESTMENT_TYPE_COLORS[item.investmentType as keyof typeof INVESTMENT_TYPE_COLORS];

            return (
              <div
                key={item.investmentId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center flex-1">
                  <div className={`p-2 rounded-lg mr-4 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(item.investedAt)} • {getInvestmentTypeName(item.investmentType)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${colorClass}`}>
                    {getInvestmentTypeName(item.investmentType)}
                  </span>
                </div>
              </div>
            );
          })}

          {(!investment?.recentInvestments || investment.recentInvestments.length === 0) && (
            <p className="text-center text-gray-500 py-8">투자 내역이 없습니다.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function getInvestmentTypeName(type: InvestmentType): string {
  const names: Record<InvestmentType, string> = {
    ROUNDUP: '라운드업',
    MANUAL: '수동',
    AUTO: '자동',
  };
  return names[type] || type;
}
