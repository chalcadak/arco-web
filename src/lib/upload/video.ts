/**
 * Cloudflare Stream 동영상 업로드 전용 모듈
 * 
 * 동영상 파일을 Cloudflare Stream API를 통해 업로드합니다.
 * Stream은 자동으로 인코딩, 썸네일 생성, HLS/DASH 스트리밍을 제공합니다.
 */

import { getEnv } from '@/lib/config/env';

// 지원하는 동영상 MIME 타입
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/webm',
  'video/x-flv',
] as const;

export type VideoMimeType = typeof SUPPORTED_VIDEO_TYPES[number];

/**
 * 동영상 파일 타입 검증
 */
export function isVideoFile(mimeType: string): boolean {
  return SUPPORTED_VIDEO_TYPES.includes(mimeType as VideoMimeType);
}

/**
 * 동영상 업로드 옵션
 */
export interface VideoUploadOptions {
  /** 파일 버퍼 또는 Blob */
  file: Buffer | Blob | File;
  /** 파일명 (확장자 포함) */
  fileName: string;
  /** MIME 타입 */
  mimeType: VideoMimeType;
  /** 메타데이터 (선택) */
  metadata?: {
    name?: string;
    requireSignedURLs?: boolean;
    allowedOrigins?: string[];
    thumbnailTimestampPct?: number; // 0-1, 썸네일 생성 위치
  };
}

/**
 * 동영상 업로드 결과
 */
export interface VideoUploadResult {
  /** 업로드 성공 여부 */
  success: boolean;
  /** Stream Video UID */
  uid: string;
  /** 스트리밍 URL (HLS) */
  playbackUrl: string;
  /** 썸네일 URL */
  thumbnailUrl: string;
  /** 대시보드 URL */
  dashboardUrl: string;
  /** 업로드 상태 */
  status: 'queued' | 'inprogress' | 'ready' | 'error';
  /** 파일 크기 (bytes) */
  size: number;
  /** 에러 메시지 (실패 시) */
  error?: string;
}

/**
 * Cloudflare Stream API URL
 */
function getStreamApiUrl(): string {
  const env = getEnv();
  return `https://api.cloudflare.com/client/v4/accounts/${env.stream.accountId}/stream`;
}

/**
 * 동영상을 Cloudflare Stream에 업로드
 * 
 * TUS (Resumable Upload) 프로토콜 사용
 */
export async function uploadVideoToStream(
  options: VideoUploadOptions
): Promise<VideoUploadResult> {
  const env = getEnv();
  const { file, fileName, mimeType, metadata } = options;
  
  // 파일 타입 검증
  if (!isVideoFile(mimeType)) {
    return {
      success: false,
      uid: '',
      playbackUrl: '',
      thumbnailUrl: '',
      dashboardUrl: '',
      status: 'error',
      size: 0,
      error: `Unsupported video type: ${mimeType}. Allowed: ${SUPPORTED_VIDEO_TYPES.join(', ')}`,
    };
  }
  
  try {
    // FormData 생성
    const formData = new FormData();
    
    // 파일 추가 (Blob으로 변환)
    const blob = file instanceof Buffer 
      ? new Blob([file], { type: mimeType })
      : file;
    
    formData.append('file', blob, fileName);
    
    // 메타데이터 추가
    if (metadata) {
      const meta: Record<string, any> = {
        name: metadata.name || fileName,
      };
      
      if (metadata.requireSignedURLs !== undefined) {
        meta.requireSignedURLs = metadata.requireSignedURLs;
      }
      
      if (metadata.allowedOrigins && metadata.allowedOrigins.length > 0) {
        meta.allowedOrigins = metadata.allowedOrigins;
      }
      
      if (metadata.thumbnailTimestampPct !== undefined) {
        meta.thumbnailTimestampPct = metadata.thumbnailTimestampPct;
      }
      
      formData.append('meta', JSON.stringify(meta));
    }
    
    // Stream API 호출
    const response = await fetch(getStreamApiUrl(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.stream.apiToken}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stream API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Stream API returned error: ${JSON.stringify(data.errors)}`);
    }
    
    const video = data.result;
    
    console.log(`✅ Video uploaded to Stream: ${video.uid}`);
    
    return {
      success: true,
      uid: video.uid,
      playbackUrl: video.playback?.hls || `https://customer-${env.stream.accountId}.cloudflarestream.com/${video.uid}/manifest/video.m3u8`,
      thumbnailUrl: video.thumbnail || `https://customer-${env.stream.accountId}.cloudflarestream.com/${video.uid}/thumbnails/thumbnail.jpg`,
      dashboardUrl: `https://dash.cloudflare.com/${env.stream.accountId}/stream/videos/${video.uid}`,
      status: video.status?.state || 'queued',
      size: video.size || 0,
    };
    
  } catch (error) {
    console.error('❌ Stream video upload failed:', error);
    
    return {
      success: false,
      uid: '',
      playbackUrl: '',
      thumbnailUrl: '',
      dashboardUrl: '',
      status: 'error',
      size: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Stream 비디오 상태 조회
 */
export async function getStreamVideoStatus(uid: string): Promise<{
  success: boolean;
  status: 'queued' | 'inprogress' | 'ready' | 'error';
  duration?: number;
  ready?: boolean;
  error?: string;
}> {
  const env = getEnv();
  
  try {
    const response = await fetch(`${getStreamApiUrl()}/${uid}`, {
      headers: {
        'Authorization': `Bearer ${env.stream.apiToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Stream API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Stream API returned error: ${JSON.stringify(data.errors)}`);
    }
    
    const video = data.result;
    
    return {
      success: true,
      status: video.status?.state || 'queued',
      duration: video.duration,
      ready: video.readyToStream,
    };
    
  } catch (error) {
    return {
      success: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Stream 비디오 삭제
 */
export async function deleteStreamVideo(uid: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const env = getEnv();
  
  try {
    const response = await fetch(`${getStreamApiUrl()}/${uid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${env.stream.apiToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Stream API error: ${response.status}`);
    }
    
    console.log(`✅ Stream video deleted: ${uid}`);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Stream video deletion failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
