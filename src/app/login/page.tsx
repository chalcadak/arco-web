import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { LoginForm } from '@/components/customer/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

export const metadata: Metadata = {
  title: '로그인 - ARCO',
  description: 'ARCO 회원 로그인',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
      <Container size="sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Heading level={1} className="mb-2 cursor-pointer hover:text-primary transition-colors">
              ARCO
            </Heading>
          </Link>
          <Text className="text-muted-foreground">로그인</Text>
        </div>

        {/* 소셜 로그인 */}
        <div className="mb-6">
          <SocialLoginButtons />
        </div>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-neutral-50 to-neutral-100 text-muted-foreground">
              또는
            </span>
          </div>
        </div>

        {/* 이메일 로그인 */}
        <LoginForm />

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <Text size="sm" className="text-muted-foreground">
            아직 계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              회원가입
            </Link>
          </Text>
        </div>

        {/* 관리자 로그인 링크 */}
        <div className="mt-4 text-center">
          <Link
            href="/admin/login"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            관리자 로그인
          </Link>
        </div>
      </Container>
    </div>
  );
}
