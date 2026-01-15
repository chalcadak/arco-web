/**
 * Cloudflare R2 이미지 업로드 전용 모듈
 * 
 * 이미지 파일을 Cloudflare R2 (S3 호환)에 업로드합니다.
 * 환경별로 다른 버킷을 사용합니다:
 * - Production: arco-store-prod
 * - Development: arco-store-test
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getEnv } from '@/lib/config/env';

// 지원하는 이미지 MIME 타입
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export type ImageMimeType = typeof SUPPORTED_IMAGE_TYPES[number];

/**
 * 이미지 파일 타입 검증
 */
export function isImageFile(mimeType: string): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(mimeType as ImageMimeType);
}

/**
 * R2 클라이언트 싱글톤
 */
let r2Client: S3Client | null = null;

/**
 * R2 클라이언트 가져오기 (캐시됨)
 */
export function getR2Client(): S3Client {
  if (!r2Client) {
    const env = getEnv();
    
    r2Client = new S3Client({
      region: 'auto',
      endpoint: env.r2.endpoint,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    });
  }
  
  return r2Client;
}

/**
 * 이미지 업로드 옵션
 */
export interface ImageUploadOptions {
  /** 파일 버퍼 또는 Blob */
  file: Buffer | Blob;
  /** 파일명 (확장자 포함) */
  fileName: string;
  /** MIME 타입 */
  mimeType: ImageMimeType;
  /** 폴더 경로 (선택, 예: 'products', 'profiles') */
  folder?: string;
  /** 메타데이터 (선택) */
  metadata?: Record<string, string>;
}

/**
 * 이미지 업로드 결과
 */
export interface ImageUploadResult {
  /** 업로드 성공 여부 */
  success: boolean;
  /** R2 내부 키 */
  key: string;
  /** 공개 URL */
  url: string;
  /** 버킷 이름 */
  bucket: string;
  /** 파일 크기 (bytes) */
  size: number;
  /** 에러 메시지 (실패 시) */
  error?: string;
}

/**
 * 이미지를 R2에 업로드
 */
export async function uploadImageToR2(
  options: ImageUploadOptions
): Promise<ImageUploadResult> {
  const env = getEnv();
  const { file, fileName, mimeType, folder, metadata } = options;
  
  // 파일 타입 검증
  if (!isImageFile(mimeType)) {
    return {
      success: false,
      key: '',
      url: '',
      bucket: env.r2.bucketName,
      size: 0,
      error: `Unsupported image type: ${mimeType}. Allowed: ${SUPPORTED_IMAGE_TYPES.join(', ')}`,
    };
  }
  
  try {
    // 파일 버퍼 변환
    const buffer = file instanceof Buffer ? file : Buffer.from(await file.arrayBuffer());
    
    // 고유 키 생성 (타임스탬프 + 랜덤)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = folder 
      ? `${folder}/${timestamp}-${random}-${sanitizedFileName}`
      : `${timestamp}-${random}-${sanitizedFileName}`;
    
    // R2 업로드
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: env.r2.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: metadata,
    });
    
    await client.send(command);
    
    // 공개 URL 생성
    const publicUrl = `${env.r2.publicUrl}/${key}`;
    
    console.log(`✅ Image uploaded to R2: ${key} (${buffer.length} bytes)`);
    
    return {
      success: true,
      key,
      url: publicUrl,
      bucket: env.r2.bucketName,
      size: buffer.length,
    };
    
  } catch (error) {
    console.error('❌ R2 image upload failed:', error);
    
    return {
      success: false,
      key: '',
      url: '',
      bucket: env.r2.bucketName,
      size: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 여러 이미지를 한번에 업로드
 */
export async function uploadMultipleImagesToR2(
  images: ImageUploadOptions[]
): Promise<ImageUploadResult[]> {
  return Promise.all(images.map(img => uploadImageToR2(img)));
}

/**
 * Base64 이미지 업로드 (웹에서 직접 업로드 시)
 */
export async function uploadBase64ImageToR2(
  base64: string,
  fileName: string,
  mimeType: ImageMimeType,
  folder?: string
): Promise<ImageUploadResult> {
  // Base64 디코딩
  const base64Data = base64.includes('base64,') 
    ? base64.split('base64,')[1] 
    : base64;
  
  const buffer = Buffer.from(base64Data, 'base64');
  
  return uploadImageToR2({
    file: buffer,
    fileName,
    mimeType,
    folder,
  });
}
