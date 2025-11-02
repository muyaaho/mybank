'use client';

import { useState } from 'react';
import { useSpendingAnalysis } from '@/lib/hooks/useSpending';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { formatCurrency } from '@/lib/utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function SpendingPage() {
  const [daysBack, setDaysBack] = useState(30);
  const { data: spending, isLoading } = useSpendingAnalysis(daysBack);

  if (isLoading) {
    return <Loading message="Loading spending analysis..." />;
  }

  const categoryChartData = spending?.categoryBreakdown.map((item, index) => ({
    name: item.category,
    amount: item.amount,
    count: item.transactionCount,
    average: item.averageAmount,
    color: COLORS[index % COLORS.length],
  })) || [];

  const pieChartData = spending?.categoryBreakdown.slice(0, 8).map((item, index) => ({
    name: item.category,
    value: item.amount,
    color: COLORS[index % COLORS.length],
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spending Analytics</h1>
          <p className="text-gray-600 mt-2">Understand your spending patterns</p>
        </div>
        <div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={daysBack}
            onChange={(e) => setDaysBack(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Spending</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {formatCurrency(spending?.totalSpending || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{spending?.period}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-full">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Spending by Category" description="Bar chart view">
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar dataKey="amount">
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No spending data available</p>
          )}
        </Card>

        <Card title="Category Distribution" description="Percentage breakdown">
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No data available</p>
          )}
        </Card>
      </div>

      <Card title="Category Details" description="Detailed breakdown of your spending">
        {categoryChartData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Transactions</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Average</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryChartData.map((category, index) => {
                  const percentage = ((category.amount / (spending?.totalSpending || 1)) * 100).toFixed(1);
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-gray-900">
                        {formatCurrency(category.amount)}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        {category.count}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        {formatCurrency(category.average)}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No category data available</p>
        )}
      </Card>
    </div>
  );
}
