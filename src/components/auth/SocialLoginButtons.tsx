'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type Provider = 'google' | 'kakao';

export function SocialLoginButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleSocialLogin = async (provider: Provider) => {
    setIsLoading(provider);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error(`${provider} login error:`, error);
        alert(`${provider} 로그인에 실패했습니다. 다시 시도해주세요.`);
        setIsLoading(null);
      }
      // OAuth 리디렉션 시작 - 로딩 상태 유지
    } catch (error) {
      console.error(`${provider} login error:`, error);
      alert('로그인 중 오류가 발생했습니다.');
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google 로그인 */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full relative"
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading !== null}
      >
        {isLoading === 'google' ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className={isLoading === 'google' ? 'opacity-50' : ''}>
          Google로 계속하기
        </span>
      </Button>

      {/* Kakao 로그인 */}
      <Button
        type="button"
        size="lg"
        className="w-full relative bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] border-0"
        onClick={() => handleSocialLogin('kakao')}
        disabled={isLoading !== null}
      >
        {isLoading === 'kakao' ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C6.477 3 2 6.464 2 10.75c0 2.764 1.845 5.182 4.615 6.517-.197.728-.643 2.409-.728 2.78-.103.45.165.445.348.323.133-.09 2.148-1.441 3.003-2.023C10.121 18.59 11.048 18.75 12 18.75c5.523 0 10-3.464 10-7.75S17.523 3 12 3z" />
          </svg>
        )}
        <span className={isLoading === 'kakao' ? 'opacity-50' : ''}>
          카카오로 계속하기
        </span>
      </Button>

      {/* Naver 로그인 - 주석 처리 (Supabase에서 기본 지원 안 함) */}
      {/* 
      <Button
        type="button"
        size="lg"
        className="w-full relative bg-[#03C75A] hover:bg-[#03C75A]/90 text-white border-0"
        onClick={() => handleSocialLogin('naver')}
        disabled={isLoading !== null}
      >
        {isLoading === 'naver' ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <span className="mr-2 font-bold text-lg">N</span>
        )}
        <span className={isLoading === 'naver' ? 'opacity-50' : ''}>
          네이버로 계속하기
        </span>
      </Button>
      */}
    </div>
  );
}
