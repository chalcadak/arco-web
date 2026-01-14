import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Cloudflare R2 클라이언트 설정
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'arco-storage';
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

/**
 * R2에 파일 업로드
 * @param file Buffer 형태의 파일 데이터
 * @param fileName 저장할 파일명 (고유)
 * @param contentType 파일 MIME 타입
 * @returns 업로드된 파일의 public URL
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: contentType,
      },
    });

    await upload.done();

    // Public URL 반환
    return `${PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error('R2 upload failed:', error);
    throw new Error('Failed to upload file to R2');
  }
}

/**
 * R2에서 파일 삭제
 * @param fileName 삭제할 파일명
 */
export async function deleteFromR2(fileName: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2 delete failed:', error);
    throw new Error('Failed to delete file from R2');
  }
}

/**
 * URL에서 파일명 추출
 * @param url R2 public URL
 * @returns 파일명
 */
export function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '';
}

/**
 * 고유한 파일명 생성
 * @param originalName 원본 파일명
 * @returns 타임스탬프가 포함된 고유 파일명
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(`.${extension}`, '');
  
  // 파일명 정리 (특수문자 제거)
  const cleanName = nameWithoutExt
    .replace(/[^a-zA-Z0-9가-힣]/g, '-')
    .toLowerCase();
  
  return `${cleanName}-${timestamp}-${random}.${extension}`;
}
