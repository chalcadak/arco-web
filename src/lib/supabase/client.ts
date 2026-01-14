import { createBrowserClient } from '@supabase/ssr';
import { getEnv } from '@/lib/config/env';

/**
 * 브라우저용 Supabase 클라이언트 생성
 * 환경 변수를 중앙에서 관리하여 타입 안전성 보장
 */
export function createClient() {
  const env = getEnv();
  
  return createBrowserClient(
    env.supabase.url,
    env.supabase.anonKey
  );
}
