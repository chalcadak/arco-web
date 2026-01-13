/**
 * Cloudflare Stream Client
 * 비디오 업로드, 스트리밍, 메타데이터 관리
 */

/**
 * Cloudflare Stream API 기본 설정
 */
const STREAM_API_BASE = 'https://api.cloudflare.com/client/v4';

/**
 * Stream API 인증 헤더 생성
 */
function getStreamHeaders(): HeadersInit {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error('Cloudflare Stream credentials are not configured');
  }

  return {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Account ID 가져오기
 */
function getAccountId(): string {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!accountId) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID is not configured');
  }
  return accountId;
}

/**
 * Stream 비디오 업로드 URL 생성
 * Direct Creator Upload 방식 사용
 */
export async function createUploadUrl(
  metadata?: Record<string, string>
): Promise<{
  success: boolean;
  uploadUrl?: string;
  videoId?: string;
  error?: string;
}> {
  try {
    const accountId = getAccountId();
    const headers = getStreamHeaders();

    const response = await fetch(
      `${STREAM_API_BASE}/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          maxDurationSeconds: 3600, // 최대 1시간
          requireSignedURLs: false, // Public 스트리밍
          metadata: metadata || {},
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Failed to create upload URL');
    }

    return {
      success: true,
      uploadUrl: data.result.uploadURL,
      videoId: data.result.uid,
    };
  } catch (error) {
    console.error('Stream upload URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 비디오 메타데이터 조회
 */
export async function getVideoMetadata(
  videoId: string
): Promise<{
  success: boolean;
  video?: {
    uid: string;
    status: string;
    thumbnail?: string;
    playback?: {
      hls: string;
      dash: string;
    };
    duration?: number;
    meta?: Record<string, any>;
  };
  error?: string;
}> {
  try {
    const accountId = getAccountId();
    const headers = getStreamHeaders();

    const response = await fetch(
      `${STREAM_API_BASE}/accounts/${accountId}/stream/${videoId}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Failed to get video metadata');
    }

    return {
      success: true,
      video: {
        uid: data.result.uid,
        status: data.result.status?.state || 'unknown',
        thumbnail: data.result.thumbnail,
        playback: data.result.playback,
        duration: data.result.duration,
        meta: data.result.meta,
      },
    };
  } catch (error) {
    console.error('Stream metadata error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 비디오 삭제
 */
export async function deleteVideo(
  videoId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const accountId = getAccountId();
    const headers = getStreamHeaders();

    const response = await fetch(
      `${STREAM_API_BASE}/accounts/${accountId}/stream/${videoId}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Failed to delete video');
    }

    return { success: true };
  } catch (error) {
    console.error('Stream delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 비디오 목록 조회
 */
export async function listVideos(options?: {
  limit?: number;
  before?: string;
  after?: string;
}): Promise<{
  success: boolean;
  videos?: Array<{
    uid: string;
    status: string;
    thumbnail?: string;
    duration?: number;
    created: string;
  }>;
  error?: string;
}> {
  try {
    const accountId = getAccountId();
    const headers = getStreamHeaders();

    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.before) params.append('before', options.before);
    if (options?.after) params.append('after', options.after);

    const response = await fetch(
      `${STREAM_API_BASE}/accounts/${accountId}/stream?${params.toString()}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Failed to list videos');
    }

    return {
      success: true,
      videos: data.result.map((video: any) => ({
        uid: video.uid,
        status: video.status?.state || 'unknown',
        thumbnail: video.thumbnail,
        duration: video.duration,
        created: video.created,
      })),
    };
  } catch (error) {
    console.error('Stream list error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 스트림 URL 헬퍼
 */
export const StreamUrls = {
  /**
   * HLS 스트리밍 URL
   */
  hls: (videoId: string) =>
    `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`,

  /**
   * 썸네일 URL
   */
  thumbnail: (videoId: string, time?: number) =>
    `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg${time ? `?time=${time}s` : ''}`,

  /**
   * iframe 임베드 URL
   */
  iframe: (videoId: string) =>
    `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/iframe`,
};
