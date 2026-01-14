/**
 * API Route: 미디어 업로드
 * 
 * POST /api/upload
 * 
 * 이미지와 동영상을 자동으로 감지하여 업로드합니다.
 * - 이미지: Cloudflare R2
 * - 동영상: Cloudflare Stream
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadMedia, detectMediaType } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // 파일 타입 확인
    const mediaType = detectMediaType(file.type);
    
    if (mediaType === 'unknown') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Unsupported file type: ${file.type}`,
          supportedTypes: {
            images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            videos: ['video/mp4', 'video/quicktime', 'video/webm'],
          }
        },
        { status: 400 }
      );
    }
    
    // 업로드
    const result = await uploadMedia({
      file,
      fileName: file.name,
      mimeType: file.type,
      folder: folder || undefined,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // 응답
    return NextResponse.json({
      success: true,
      type: result.type,
      data: result.type === 'image' ? {
        url: result.image?.url,
        key: result.image?.key,
        bucket: result.image?.bucket,
        size: result.image?.size,
      } : {
        uid: result.video?.uid,
        playbackUrl: result.video?.playbackUrl,
        thumbnailUrl: result.video?.thumbnailUrl,
        status: result.video?.status,
        size: result.video?.size,
      },
    });
    
  } catch (error) {
    console.error('Upload API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
