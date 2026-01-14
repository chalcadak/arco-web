import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { SignupForm } from '@/components/customer/SignupForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

export const metadata: Metadata = {
  title: '회원가입 - ARCO',
  description: 'ARCO 회원가입',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
      <Container size="sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Heading level={1} className="mb-2 cursor-pointer hover:text-primary transition-colors">
              ARCO
            </Heading>
          </Link>
          <Text className="text-muted-foreground">회원가입</Text>
        </div>

        {/* 소셜 회원가입 */}
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

        {/* 이메일 회원가입 */}
        <SignupForm />

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <Text size="sm" className="text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              로그인
            </Link>
          </Text>
        </div>
      </Container>
    </div>
  );
}
