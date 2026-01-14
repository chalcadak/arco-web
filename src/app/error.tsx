'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-6">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground">500</h1>
            <h2 className="text-2xl font-semibold">문제가 발생했습니다</h2>
            <p className="text-muted-foreground">
              일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>

          {error.digest && (
            <div className="bg-muted px-4 py-2 rounded text-xs text-muted-foreground font-mono">
              Error ID: {error.digest}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={reset} className="flex-1" size="lg">
              <RefreshCcw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              문제가 계속되면{' '}
              <Link href="/contact" className="text-primary hover:underline">
                고객센터
              </Link>
              로 문의해주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
