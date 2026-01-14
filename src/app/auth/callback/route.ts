import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/my-page';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(
          new URL('/login?error=oauth_failed', requestUrl.origin)
        );
      }

      // 세션이 성공적으로 생성되면 사용자 정보 확인
      if (data.user) {
        console.log('OAuth login successful:', data.user.email);
        
        // 프로필 생성은 Supabase 트리거로 자동 처리됨
        // (handle_new_user 함수)
        
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      return NextResponse.redirect(
        new URL('/login?error=oauth_failed', requestUrl.origin)
      );
    }
  }

  // 코드가 없으면 로그인 페이지로 리디렉션
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}
