// src/components/admin/charts/SalesChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SalesChartProps {
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  height?: number;
}

export function SalesChart({ data, height = 300 }: SalesChartProps) {
  // 데이터 포맷팅
  const chartData = data.map(item => ({
    date: item.date,
    매출: item.revenue,
    주문수: item.orders,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
          tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          formatter={(value: any, name: string) => {
            if (name === '매출') {
              return [`${(value / 10000).toFixed(1)}만원`, name];
            }
            return [`${value}건`, name];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '14px' }}
          iconType="line"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="매출"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="주문수"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
