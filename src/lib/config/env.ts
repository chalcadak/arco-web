/**
 * 환경 변수 관리 및 검증 유틸리티
 * 
 * 모든 환경 변수를 중앙에서 관리하고 타입 안전성을 보장합니다.
 */

// 환경 타입
export type Environment = 'development' | 'production' | 'preview';

// 환경 변수 인터페이스
export interface EnvConfig {
  // 환경 구분
  env: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isPreview: boolean;
  
  // Supabase
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  
  // Cloudflare R2 (이미지)
  r2: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
    endpoint: string;
  };
  
  // Cloudflare Stream (동영상)
  stream: {
    accountId: string;
    apiToken: string;
  };
  
  // Toss Payments
  toss: {
    clientKey: string;
    secretKey: string;
  };
  
  // App
  app: {
    url: string;
    adminEmail: string;
  };
}

/**
 * 필수 환경 변수 검증
 */
function validateEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * 환경 변수를 가져오고 타입 안전성을 보장
 */
export function getEnvConfig(): EnvConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development'
  
  // Vercel에서는 VERCEL_ENV를 우선 사용
  let env: Environment = 'development';
  if (vercelEnv === 'production') {
    env = 'production';
  } else if (vercelEnv === 'preview') {
    env = 'preview';
  } else if (nodeEnv === 'production') {
    env = 'production';
  }
  
  return {
    // 환경
    env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isPreview: env === 'preview',
    
    // Supabase
    supabase: {
      url: validateEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
      anonKey: validateEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      serviceRoleKey: validateEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    
    // Cloudflare R2
    r2: {
      accountId: validateEnv('CLOUDFLARE_ACCOUNT_ID', process.env.CLOUDFLARE_ACCOUNT_ID),
      accessKeyId: validateEnv('CLOUDFLARE_R2_ACCESS_KEY_ID', process.env.CLOUDFLARE_R2_ACCESS_KEY_ID),
      secretAccessKey: validateEnv('CLOUDFLARE_R2_SECRET_ACCESS_KEY', process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY),
      bucketName: validateEnv('CLOUDFLARE_R2_BUCKET_NAME', process.env.CLOUDFLARE_R2_BUCKET_NAME),
      publicUrl: validateEnv('CLOUDFLARE_R2_PUBLIC_URL', process.env.CLOUDFLARE_R2_PUBLIC_URL),
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || 
                `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    },
    
    // Cloudflare Stream
    stream: {
      accountId: process.env.CLOUDFLARE_STREAM_ACCOUNT_ID || 
                 validateEnv('CLOUDFLARE_ACCOUNT_ID', process.env.CLOUDFLARE_ACCOUNT_ID),
      apiToken: validateEnv('CLOUDFLARE_STREAM_API_TOKEN', process.env.CLOUDFLARE_STREAM_API_TOKEN),
    },
    
    // Toss Payments
    toss: {
      clientKey: validateEnv('NEXT_PUBLIC_TOSS_CLIENT_KEY', process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY),
      secretKey: validateEnv('TOSS_SECRET_KEY', process.env.TOSS_SECRET_KEY),
    },
    
    // App
    app: {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@arco.com',
    },
  };
}

/**
 * 환경 변수 로깅 (민감한 정보 제외)
 */
export function logEnvConfig(): void {
  const config = getEnvConfig();
  
  console.log('🔧 Environment Configuration:');
  console.log('├─ Environment:', config.env);
  console.log('├─ Supabase URL:', config.supabase.url);
  console.log('├─ R2 Bucket:', config.r2.bucketName);
  console.log('├─ R2 Public URL:', config.r2.publicUrl);
  console.log('├─ Stream Account:', config.stream.accountId);
  console.log('├─ App URL:', config.app.url);
  console.log('└─ Admin Email:', config.app.adminEmail);
}

// 싱글톤 패턴으로 환경 설정 캐싱
let cachedEnvConfig: EnvConfig | null = null;

/**
 * 캐시된 환경 설정 가져오기
 */
export function getEnv(): EnvConfig {
  if (!cachedEnvConfig) {
    cachedEnvConfig = getEnvConfig();
    
    // 개발 환경에서만 로깅
    if (cachedEnvConfig.isDevelopment && typeof window === 'undefined') {
      logEnvConfig();
    }
  }
  
  return cachedEnvConfig;
}
