// src/components/admin/BestSellersTable.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/typography';
import { Trophy, TrendingUp } from 'lucide-react';

interface BestSellersTableProps {
  products: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  limit?: number;
}

export function BestSellersTable({ products, limit = 10 }: BestSellersTableProps) {
  const topProducts = products.slice(0, limit);

  // 메달 색상
  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-300';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <CardTitle>베스트셀러 TOP {limit}</CardTitle>
        </div>
        <Text size="sm" className="text-muted-foreground">
          최근 30일 기준
        </Text>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <Text size="sm" className="text-muted-foreground text-center py-8">
            판매 데이터가 없습니다
          </Text>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, index) => {
              const rank = index + 1;
              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    rank <= 3 ? 'bg-gradient-to-r from-gray-50 to-white border border-gray-200' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* 순위 */}
                  <div className="flex-shrink-0 w-8 text-center">
                    {rank <= 3 ? (
                      <Trophy className={`w-6 h-6 ${getMedalColor(rank)} mx-auto`} />
                    ) : (
                      <Text className="font-bold text-gray-400">{rank}</Text>
                    )}
                  </div>

                  {/* 상품명 */}
                  <div className="flex-1 min-w-0">
                    <Text className="font-medium truncate">{product.name}</Text>
                    <Text size="xs" className="text-muted-foreground">
                      판매: {product.sales}개
                    </Text>
                  </div>

                  {/* 매출 */}
                  <div className="flex-shrink-0 text-right">
                    <Text className="font-semibold text-green-600">
                      {(product.revenue / 10000).toFixed(0)}만원
                    </Text>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <Text size="xs" className="text-green-600">
                        {((product.sales / topProducts[0].sales) * 100).toFixed(0)}%
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
