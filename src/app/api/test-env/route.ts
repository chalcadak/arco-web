/**
 * 환경 변수 테스트 페이지
 * 
 * 접속: /api/test-env
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/config/env';

export async function GET(request: NextRequest) {
  try {
    const env = getEnv();
    
    return NextResponse.json({
      success: true,
      environment: env.env,
      isDevelopment: env.isDevelopment,
      isProduction: env.isProduction,
      isPreview: env.isPreview,
      config: {
        supabase: {
          url: env.supabase.url,
          hasAnonKey: !!env.supabase.anonKey,
          hasServiceRoleKey: !!env.supabase.serviceRoleKey,
        },
        r2: {
          bucketName: env.r2.bucketName,
          publicUrl: env.r2.publicUrl,
          hasAccessKey: !!env.r2.accessKeyId,
          hasSecretKey: !!env.r2.secretAccessKey,
        },
        stream: {
          accountId: env.stream.accountId,
          hasApiToken: !!env.stream.apiToken,
        },
        app: {
          url: env.app.url,
          adminEmail: env.app.adminEmail,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
