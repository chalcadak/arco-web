import { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';

export const metadata: Metadata = {
  title: '관리자 로그인 - ARCO',
  description: 'ARCO 관리자 페이지 로그인',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Container size="sm">
        <div className="text-center mb-8">
          <Heading level={1} className="mb-2">ARCO</Heading>
          <Text className="text-muted-foreground">관리자 로그인</Text>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center">
          <Text size="sm" className="text-muted-foreground">관리자 계정으로만 접근 가능합니다.</Text>
        </div>
      </Container>
    </div>
  );
}
