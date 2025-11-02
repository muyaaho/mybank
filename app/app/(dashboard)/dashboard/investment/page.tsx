'use client';

import { useState } from 'react';
import { useInvestmentSummary, useRoundUpToggle } from '@/lib/hooks/useInvestments';
import { useAssets } from '@/lib/hooks/useAssets';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { InvestmentType } from '@/types/api';

const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  ROUNDUP: 'Round-up Savings',
  MANUAL: 'Manual Investment',
  AUTO: 'Auto Investment',
};

const INVESTMENT_TYPE_COLORS: Record<InvestmentType, string> = {
  ROUNDUP: 'bg-blue-100 text-blue-800',
  MANUAL: 'bg-green-100 text-green-800',
  AUTO: 'bg-purple-100 text-purple-800',
};

export default function InvestmentPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const { data: investments, isLoading: investmentsLoading } = useInvestmentSummary();
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { enableRoundUp, disableRoundUp, isLoading: toggleLoading } = useRoundUpToggle();

  const handleToggleRoundUp = (enabled: boolean) => {
    if (!selectedAccountId) {
      alert('Please select an account first');
      return;
    }

    if (enabled) {
      enableRoundUp(selectedAccountId);
    } else {
      disableRoundUp(selectedAccountId);
    }
  };

  if (investmentsLoading || assetsLoading) {
    return <Loading message="Loading investments..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
        <p className="text-gray-600 mt-2">Grow your wealth with smart savings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(investments?.totalInvested || 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Round-up Savings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(investments?.totalRoundedUp || 0)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {investments?.totalRoundUpTransactions || 0} transactions
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Investments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {investments?.recentInvestments.length || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Round-up Settings */}
      <Card title="Round-up Savings" description="Automatically invest your spare change">
        <div className="space-y-4">
          <p className="text-gray-700">
            Every time you make a purchase, we'll round up to the nearest dollar and invest the difference.
            For example, a $4.30 purchase becomes $5.00, and $0.70 goes into your investment account.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Account for Round-up
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="">Choose an account</option>
              {assets?.assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.accountName} - {formatCurrency(asset.balance)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => handleToggleRoundUp(true)}
              isLoading={toggleLoading}
              disabled={!selectedAccountId}
            >
              Enable Round-up
            </Button>
            <Button
              variant="danger"
              onClick={() => handleToggleRoundUp(false)}
              isLoading={toggleLoading}
              disabled={!selectedAccountId}
            >
              Disable Round-up
            </Button>
          </div>
        </div>
      </Card>

      {/* Investment History */}
      <Card title="Recent Investments" description="Your latest investment activities">
        {investments && investments.recentInvestments.length > 0 ? (
          <div className="space-y-3">
            {investments.recentInvestments.map((investment) => (
              <div
                key={investment.investmentId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{investment.productName}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${INVESTMENT_TYPE_COLORS[investment.investmentType]}`}>
                      {INVESTMENT_TYPE_LABELS[investment.investmentType]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(new Date(investment.investedAt))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    +{formatCurrency(investment.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No investments yet</p>
        )}
      </Card>

      {/* Investment Tips */}
      <Card title="Investment Tips">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Start Small</h4>
            <p className="text-sm text-blue-700">
              Round-up savings let you invest without thinking about it. Small amounts add up over time!
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Stay Consistent</h4>
            <p className="text-sm text-green-700">
              Regular investments, even small ones, can grow significantly with compound interest.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Diversify</h4>
            <p className="text-sm text-purple-700">
              Don't put all your eggs in one basket. Spread your investments across different assets.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Long-term Vision</h4>
            <p className="text-sm text-yellow-700">
              Investing is a marathon, not a sprint. Stay focused on your long-term goals.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
