import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <AlertCircle className="w-16 h-16 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground">
              요청하신 페이지가 존재하지 않거나 이동되었습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <Search className="w-4 h-4 mr-2" />
                상품 둘러보기
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
