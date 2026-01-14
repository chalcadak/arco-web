import { NextRequest, NextResponse } from 'next/server';
import { uploadVideoToStream, deleteVideoFromStream } from '@/lib/cloudflare/stream';

// 허용된 영상 MIME 타입
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/webm',
];

// 최대 파일 크기 (200MB)
const MAX_FILE_SIZE = 200 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: `Invalid file type: ${file.type}. Allowed types: MP4, MOV, AVI, MKV, WebM` 
        },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size: 200MB` },
        { status: 400 }
      );
    }

    // 파일명 정리
    const fileName = file.name.replace(/[^a-zA-Z0-9가-힣.-]/g, '-');

    // Cloudflare Stream에 업로드
    const videoInfo = await uploadVideoToStream(file, {
      name: fileName,
      requireSignedURLs: false, // Public 접근 허용
    });

    return NextResponse.json({
      success: true,
      video: {
        uid: videoInfo.uid,
        playbackUrl: videoInfo.playbackUrl,
        thumbnailUrl: videoInfo.thumbnailUrl,
        status: videoInfo.status,
        fileName: fileName,
      },
    });
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

// 영상 삭제 엔드포인트
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'UID parameter is required' },
        { status: 400 }
      );
    }

    // Cloudflare Stream에서 삭제
    await deleteVideoFromStream(uid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Video delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
