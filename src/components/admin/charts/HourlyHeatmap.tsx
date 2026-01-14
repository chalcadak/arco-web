// src/components/admin/charts/HourlyHeatmap.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HourlyHeatmapProps {
  data: {
    hour: number;
    count: number;
  }[];
  height?: number;
}

export function HourlyHeatmap({ data, height = 250 }: HourlyHeatmapProps) {
  // 최대값 찾기 (색상 그라데이션용)
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // 색상 결정 함수
  const getColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity === 0) return '#f3f4f6'; // gray-100
    if (intensity < 0.25) return '#dbeafe'; // blue-100
    if (intensity < 0.50) return '#93c5fd'; // blue-300
    if (intensity < 0.75) return '#3b82f6'; // blue-500
    return '#1d4ed8'; // blue-700
  };

  // 차트 데이터 포맷팅
  const chartData = data.map(item => ({
    시간: `${item.hour}시`,
    주문수: item.count,
    color: getColor(item.count),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="시간"
          tick={{ fontSize: 11 }}
          stroke="#6b7280"
          interval={1}
        />
        <YAxis
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
          formatter={(value: any) => [`${value}건`, '주문수']}
        />
        <Bar dataKey="주문수" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
