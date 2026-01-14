// src/components/admin/charts/DailyOrdersChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DailyOrdersChartProps {
  data: {
    day: string;
    count: number;
    revenue: number;
  }[];
  height?: number;
}

export function DailyOrdersChart({ data, height = 300 }: DailyOrdersChartProps) {
  // 차트 데이터 포맷팅
  const chartData = data.map(item => ({
    요일: item.day,
    주문수: item.count,
    매출: item.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="요일"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
          tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
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
          iconType="rect"
        />
        <Bar
          yAxisId="left"
          dataKey="주문수"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="right"
          dataKey="매출"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
