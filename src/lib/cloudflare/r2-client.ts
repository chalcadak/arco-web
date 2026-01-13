/**
 * Cloudflare R2 Client
 * S3-compatible API를 사용하여 Cloudflare R2에 파일을 업로드/다운로드
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 클라이언트 인스턴스
let r2Client: S3Client | null = null;

/**
 * R2 클라이언트 초기화
 */
export function getR2Client(): S3Client {
  if (!r2Client) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('Cloudflare R2 credentials are not configured');
    }

    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return r2Client;
}

/**
 * 버킷 이름 가져오기
 */
export function getBucketName(): string {
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('CLOUDFLARE_R2_BUCKET_NAME is not configured');
  }
  return bucketName;
}

/**
 * 파일 업로드
 * @param key 파일 경로 (예: 'products/abc123.jpg')
 * @param body 파일 데이터
 * @param contentType MIME 타입
 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType?: string
): Promise<{ success: boolean; key: string; url?: string; error?: string }> {
  try {
    const client = getR2Client();
    const bucketName = getBucketName();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await client.send(command);

    // Public URL 생성 (Cloudflare R2 public bucket 사용 시)
    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
      ? `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
      : undefined;

    return {
      success: true,
      key,
      url: publicUrl,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 파일 다운로드 (Signed URL 생성)
 * @param key 파일 경로
 * @param expiresIn URL 유효 시간 (초, 기본 1시간)
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const client = getR2Client();
    const bucketName = getBucketName();

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(client, command, { expiresIn });

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error('R2 signed URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 파일 삭제
 * @param key 파일 경로
 */
export async function deleteFile(
  key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getR2Client();
    const bucketName = getBucketName();

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await client.send(command);

    return { success: true };
  } catch (error) {
    console.error('R2 delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 파일 존재 여부 확인
 * @param key 파일 경로
 */
export async function fileExists(
  key: string
): Promise<{ exists: boolean; size?: number; error?: string }> {
  try {
    const client = getR2Client();
    const bucketName = getBucketName();

    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await client.send(command);

    return {
      exists: true,
      size: response.ContentLength,
    };
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return { exists: false };
    }

    console.error('R2 file check error:', error);
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 파일 경로 생성 헬퍼
 */
export const R2Paths = {
  /**
   * 상품 이미지 경로
   */
  productImage: (productId: string, filename: string) =>
    `products/${productId}/${filename}`,

  /**
   * 촬영룩 이미지 경로
   */
  photoshootImage: (lookId: string, filename: string) =>
    `photoshoots/${lookId}/${filename}`,

  /**
   * 갤러리 이미지 경로 (납품)
   */
  galleryImage: (galleryId: string, filename: string) =>
    `galleries/${galleryId}/${filename}`,

  /**
   * 임시 업로드 경로
   */
  temp: (filename: string) => `temp/${Date.now()}-${filename}`,
};
