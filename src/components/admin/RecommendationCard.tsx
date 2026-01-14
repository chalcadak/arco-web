// AI 추천 액션 카드 UI 컴포넌트
'use client';

import { useState } from 'react';
import { Recommendation, RecommendationAction } from '@/lib/analytics/recommendations';
import { Button } from '@/components/ui/button';

const priorityStyles = {
  urgent: 'bg-red-50 border-red-200',
  high: 'bg-orange-50 border-orange-200',
  medium: 'bg-blue-50 border-blue-200',
  low: 'bg-gray-50 border-gray-200'
};

const priorityBadges = {
  urgent: 'bg-red-100 text-red-700 border-red-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  medium: 'bg-blue-100 text-blue-700 border-blue-300',
  low: 'bg-gray-100 text-gray-700 border-gray-300'
};

const priorityLabels = {
  urgent: '🚨 긴급',
  high: '⚠️ 높음',
  medium: '📌 보통',
  low: '💡 제안'
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onExecuteAction?: (action: RecommendationAction) => Promise<void>;
}

export function RecommendationCard({ recommendation, onExecuteAction }: RecommendationCardProps) {
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set());

  const handleExecuteAction = async (action: RecommendationAction) => {
    if (!onExecuteAction) return;
    
    setExecutingAction(action.id);
    try {
      await onExecuteAction(action);
      setExecutedActions(prev => new Set(prev).add(action.id));
    } catch (error) {
      console.error('Failed to execute action:', error);
    } finally {
      setExecutingAction(null);
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${priorityStyles[recommendation.priority]}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded border ${priorityBadges[recommendation.priority]}`}>
              {priorityLabels[recommendation.priority]}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(recommendation.createdAt).toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            {recommendation.title}
          </h3>
          <p className="text-sm text-gray-600">
            {recommendation.description}
          </p>
        </div>
      </div>

      {/* Impact */}
      <div className="bg-white rounded p-3 mb-3 border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">예상 효과</div>
            <div className="text-sm font-semibold text-gray-900">
              {recommendation.impact}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {recommendation.actions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-2">
            💡 즉시 실행 가능한 액션
          </div>
          {recommendation.actions.map((action) => {
            const isExecuted = executedActions.has(action.id);
            const isExecuting = executingAction === action.id;
            
            return (
              <Button
                key={action.id}
                onClick={() => handleExecuteAction(action)}
                disabled={isExecuting || isExecuted}
                className={`w-full justify-start text-left ${
                  isExecuted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-300' 
                    : ''
                }`}
                variant={isExecuted ? 'outline' : 'default'}
                size="sm"
              >
                <span className="mr-2">{action.icon || '▶️'}</span>
                {isExecuting ? '실행 중...' : isExecuted ? '✅ 실행 완료' : action.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Data Preview (for debugging) */}
      {process.env.NODE_ENV === 'development' && recommendation.data && (
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            상세 데이터 보기
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32 text-xs">
            {JSON.stringify(recommendation.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

interface RecommendationListProps {
  recommendations: Recommendation[];
  onExecuteAction?: (action: RecommendationAction) => Promise<void>;
}

export function RecommendationList({ recommendations, onExecuteAction }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">✨</div>
        <div className="text-sm">현재 추천할 액션이 없습니다</div>
        <div className="text-xs text-gray-400 mt-1">
          데이터가 쌓이면 AI가 자동으로 액션을 추천합니다
        </div>
      </div>
    );
  }

  const urgentCount = recommendations.filter(r => r.priority === 'urgent').length;
  const highCount = recommendations.filter(r => r.priority === 'high').length;

  return (
    <div>
      {/* Summary */}
      {(urgentCount > 0 || highCount > 0) && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">⚡</span>
            <div>
              <span className="font-semibold text-yellow-900">
                {urgentCount > 0 && `긴급 ${urgentCount}건`}
                {urgentCount > 0 && highCount > 0 && ', '}
                {highCount > 0 && `중요 ${highCount}건`}
              </span>
              <span className="text-yellow-700 ml-1">
                - 즉시 조치가 필요합니다
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Cards */}
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onExecuteAction={onExecuteAction}
          />
        ))}
      </div>
    </div>
  );
}
