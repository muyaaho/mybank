'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { pfmApi } from '@/lib/api/endpoints';
import { formatCurrency } from '@/lib/utils/format';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Wallet, CreditCard, Building2 } from 'lucide-react';
import { AssetType } from '@/types/api';

const COLORS = {
  BANK: '#0ea5e9',
  CARD: '#8b5cf6',
  SECURITIES: '#10b981',
  INSURANCE: '#f59e0b',
  FINTECH: '#ef4444',
};

const ASSET_ICONS = {
  BANK: Building2,
  CARD: CreditCard,
  SECURITIES: TrendingUp,
  INSURANCE: Wallet,
  FINTECH: Wallet,
};

export default function DashboardPage() {
  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await pfmApi.getAssets();
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
        자산 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const chartData = assets?.categoryBreakdown.map((item) => ({
    name: getAssetTypeName(item.assetType),
    value: item.totalValue,
    color: COLORS[item.assetType as keyof typeof COLORS],
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">자산 현황을 한눈에 확인하세요</p>
      </div>

      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">총 자산</p>
            <h2 className="text-4xl font-bold mt-2">
              {formatCurrency(assets?.totalBalance || 0)}
            </h2>
          </div>
          <Wallet className="w-16 h-16 opacity-50" />
        </div>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card title="자산 분류">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category List */}
        <Card title="카테고리별 상세">
          <div className="space-y-4">
            {assets?.categoryBreakdown.map((category) => {
              const Icon = ASSET_ICONS[category.assetType as keyof typeof ASSET_ICONS];
              return (
                <div
                  key={category.assetType}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="p-2 rounded-lg mr-4"
                      style={{ backgroundColor: `${COLORS[category.assetType as keyof typeof COLORS]}20` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: COLORS[category.assetType as keyof typeof COLORS] }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getAssetTypeName(category.assetType)}
                      </p>
                      <p className="text-sm text-gray-500">{category.count}개 계좌</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(category.totalValue)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Assets List */}
      <Card title="보유 자산 목록">
        <div className="space-y-3">
          {assets?.assets.map((asset) => {
            const Icon = ASSET_ICONS[asset.assetType as keyof typeof ASSET_ICONS];
            return (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className="p-2 rounded-lg mr-4"
                    style={{ backgroundColor: `${COLORS[asset.assetType as keyof typeof COLORS]}20` }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: COLORS[asset.assetType as keyof typeof COLORS] }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{asset.accountName}</p>
                    <p className="text-sm text-gray-500">{asset.institutionName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(asset.currentValue)}
                  </p>
                  <p className="text-xs text-gray-500">{getAssetTypeName(asset.assetType)}</p>
                </div>
              </div>
            );
          })}

          {(!assets?.assets || assets.assets.length === 0) && (
            <p className="text-center text-gray-500 py-8">등록된 자산이 없습니다.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function getAssetTypeName(type: AssetType): string {
  const names: Record<AssetType, string> = {
    BANK: '은행',
    CARD: '카드',
    SECURITIES: '증권',
    INSURANCE: '보험',
    FINTECH: '핀테크',
  };
  return names[type] || type;
}
