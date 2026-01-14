/**
 * 통합 미디어 업로드 래퍼
 * 
 * 파일 타입을 자동으로 감지하여 이미지는 R2로, 동영상은 Stream으로 업로드합니다.
 * 프론트엔드에서 간단하게 사용할 수 있는 통합 API를 제공합니다.
 */

import { 
  uploadImageToR2, 
  uploadMultipleImagesToR2,
  uploadBase64ImageToR2,
  isImageFile,
  type ImageUploadOptions,
  type ImageUploadResult,
  SUPPORTED_IMAGE_TYPES,
} from './image';

import { 
  uploadVideoToStream, 
  getStreamVideoStatus,
  deleteStreamVideo,
  isVideoFile,
  type VideoUploadOptions,
  type VideoUploadResult,
  SUPPORTED_VIDEO_TYPES,
} from './video';

/**
 * 통합 미디어 타입
 */
export type MediaType = 'image' | 'video' | 'unknown';

/**
 * 통합 업로드 옵션
 */
export interface MediaUploadOptions {
  /** 파일 (Buffer, Blob, File) */
  file: Buffer | Blob | File;
  /** 파일명 */
  fileName: string;
  /** MIME 타입 */
  mimeType: string;
  /** 폴더 (이미지만 해당) */
  folder?: string;
  /** 메타데이터 */
  metadata?: Record<string, any>;
}

/**
 * 통합 업로드 결과
 */
export interface MediaUploadResult {
  success: boolean;
  type: MediaType;
  /** 이미지 결과 (이미지인 경우) */
  image?: ImageUploadResult;
  /** 동영상 결과 (동영상인 경우) */
  video?: VideoUploadResult;
  error?: string;
}

/**
 * 파일 타입 감지
 */
export function detectMediaType(mimeType: string): MediaType {
  if (isImageFile(mimeType)) return 'image';
  if (isVideoFile(mimeType)) return 'video';
  return 'unknown';
}

/**
 * 지원하는 미디어 타입인지 확인
 */
export function isSupportedMediaType(mimeType: string): boolean {
  return isImageFile(mimeType) || isVideoFile(mimeType);
}

/**
 * 미디어 파일 자동 업로드
 * 
 * 파일 타입을 자동 감지하여 적절한 저장소에 업로드합니다:
 * - 이미지: Cloudflare R2
 * - 동영상: Cloudflare Stream
 * 
 * @example
 * ```typescript
 * // 이미지 업로드
 * const result = await uploadMedia({
 *   file: imageFile,
 *   fileName: 'product.jpg',
 *   mimeType: 'image/jpeg',
 *   folder: 'products',
 * });
 * 
 * if (result.success && result.image) {
 *   console.log('Image URL:', result.image.url);
 * }
 * 
 * // 동영상 업로드
 * const result = await uploadMedia({
 *   file: videoFile,
 *   fileName: 'demo.mp4',
 *   mimeType: 'video/mp4',
 * });
 * 
 * if (result.success && result.video) {
 *   console.log('Video URL:', result.video.playbackUrl);
 * }
 * ```
 */
export async function uploadMedia(
  options: MediaUploadOptions
): Promise<MediaUploadResult> {
  const { file, fileName, mimeType, folder, metadata } = options;
  
  // 타입 감지
  const mediaType = detectMediaType(mimeType);
  
  // 지원하지 않는 타입
  if (mediaType === 'unknown') {
    return {
      success: false,
      type: 'unknown',
      error: `Unsupported media type: ${mimeType}. Supported: ${[...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES].join(', ')}`,
    };
  }
  
  // 이미지 업로드
  if (mediaType === 'image') {
    const result = await uploadImageToR2({
      file,
      fileName,
      mimeType: mimeType as any,
      folder,
      metadata: metadata as Record<string, string>,
    });
    
    return {
      success: result.success,
      type: 'image',
      image: result,
      error: result.error,
    };
  }
  
  // 동영상 업로드
  if (mediaType === 'video') {
    const result = await uploadVideoToStream({
      file,
      fileName,
      mimeType: mimeType as any,
      metadata,
    });
    
    return {
      success: result.success,
      type: 'video',
      video: result,
      error: result.error,
    };
  }
  
  return {
    success: false,
    type: 'unknown',
    error: 'Unknown media type',
  };
}

/**
 * 여러 미디어 파일 업로드
 */
export async function uploadMultipleMedia(
  files: MediaUploadOptions[]
): Promise<MediaUploadResult[]> {
  return Promise.all(files.map(file => uploadMedia(file)));
}

/**
 * Base64 미디어 업로드 (웹에서 직접 업로드)
 */
export async function uploadBase64Media(
  base64: string,
  fileName: string,
  mimeType: string,
  folder?: string
): Promise<MediaUploadResult> {
  const mediaType = detectMediaType(mimeType);
  
  if (mediaType === 'image') {
    const result = await uploadBase64ImageToR2(
      base64,
      fileName,
      mimeType as any,
      folder
    );
    
    return {
      success: result.success,
      type: 'image',
      image: result,
      error: result.error,
    };
  }
  
  // 동영상은 Base64 업로드 지원 안 함 (파일이 너무 큼)
  return {
    success: false,
    type: 'video',
    error: 'Base64 video upload is not supported. Please use file upload.',
  };
}

/**
 * File 객체로부터 직접 업로드
 */
export async function uploadFromFile(
  file: File,
  folder?: string
): Promise<MediaUploadResult> {
  return uploadMedia({
    file,
    fileName: file.name,
    mimeType: file.type,
    folder,
  });
}

/**
 * 여러 File 객체 업로드
 */
export async function uploadMultipleFiles(
  files: File[],
  folder?: string
): Promise<MediaUploadResult[]> {
  return Promise.all(
    files.map(file => uploadFromFile(file, folder))
  );
}

// Re-export 유틸리티
export {
  // Image
  isImageFile,
  SUPPORTED_IMAGE_TYPES,
  uploadImageToR2,
  uploadMultipleImagesToR2,
  uploadBase64ImageToR2,
  
  // Video
  isVideoFile,
  SUPPORTED_VIDEO_TYPES,
  uploadVideoToStream,
  getStreamVideoStatus,
  deleteStreamVideo,
};

// Re-export 타입
export type {
  ImageUploadOptions,
  ImageUploadResult,
  VideoUploadOptions,
  VideoUploadResult,
};
