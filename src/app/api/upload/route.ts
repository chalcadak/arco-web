import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadToR2, generateUniqueFileName } from '@/lib/cloudflare/r2';

// 허용된 이미지 MIME 타입
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // 파일 검증
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size: 10MB` },
          { status: 400 }
        );
      }
    }

    // 파일 업로드 처리
    const uploadedUrls: string[] = [];

    for (const file of files) {
      // 파일을 Buffer로 변환
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Sharp로 이미지 최적화
      // 1. 최대 너비 1920px로 리사이즈
      // 2. WebP로 변환 (용량 절감)
      // 3. 품질 85%
      const optimizedBuffer = await sharp(buffer)
        .resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: 85 })
        .toBuffer();

      // 파일명 생성 (확장자를 webp로 변경)
      const originalName = file.name.replace(/\.[^.]+$/, '.webp');
      const uniqueFileName = generateUniqueFileName(originalName);

      // R2에 업로드
      const publicUrl = await uploadToR2(
        optimizedBuffer,
        uniqueFileName,
        'image/webp'
      );

      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// 단일 파일 삭제 엔드포인트
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // URL에서 파일명 추출
    const fileName = url.split('/').pop();
    if (!fileName) {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // R2에서 삭제
    const { deleteFromR2 } = await import('@/lib/cloudflare/r2');
    await deleteFromR2(fileName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
