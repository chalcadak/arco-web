/**
 * Cloudflare Stream API 클라이언트
 * 영상 업로드 및 관리
 */

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CLOUDFLARE_STREAM_API_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN || '';

const STREAM_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`;

/**
 * Cloudflare Stream에 영상 업로드
 * @param file 영상 파일 (Buffer 또는 File)
 * @param metadata 영상 메타데이터 (제목, 설명 등)
 * @returns 업로드된 영상 정보 (UID, playback URL 등)
 */
export async function uploadVideoToStream(
  file: Buffer | File,
  metadata?: {
    name?: string;
    requireSignedURLs?: boolean;
    allowedOrigins?: string[];
  }
): Promise<{
  uid: string;
  playbackUrl: string;
  thumbnailUrl: string;
  status: string;
}> {
  try {
    const formData = new FormData();

    // 파일 추가
    if (file instanceof Buffer) {
      const blob = new Blob([file]);
      formData.append('file', blob);
    } else {
      formData.append('file', file);
    }

    // 메타데이터 추가
    if (metadata) {
      if (metadata.name) {
        formData.append('name', metadata.name);
      }
      if (metadata.requireSignedURLs !== undefined) {
        formData.append(
          'requireSignedURLs',
          metadata.requireSignedURLs.toString()
        );
      }
      if (metadata.allowedOrigins && metadata.allowedOrigins.length > 0) {
        formData.append('allowedOrigins', metadata.allowedOrigins.join(','));
      }
    }

    // API 호출
    const response = await fetch(STREAM_API_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stream upload failed: ${error}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Stream upload failed: ${JSON.stringify(data.errors)}`);
    }

    const video = data.result;

    return {
      uid: video.uid,
      playbackUrl: `https://customer-${CLOUDFLARE_ACCOUNT_ID.substring(0, 8)}.cloudflarestream.com/${video.uid}/manifest/video.m3u8`,
      thumbnailUrl: video.thumbnail || `https://customer-${CLOUDFLARE_ACCOUNT_ID.substring(0, 8)}.cloudflarestream.com/${video.uid}/thumbnails/thumbnail.jpg`,
      status: video.status?.state || 'pending',
    };
  } catch (error) {
    console.error('Stream upload error:', error);
    throw error;
  }
}

/**
 * Cloudflare Stream에서 영상 삭제
 * @param uid 영상 UID
 */
export async function deleteVideoFromStream(uid: string): Promise<void> {
  try {
    const response = await fetch(`${STREAM_API_BASE}/${uid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stream delete failed: ${error}`);
    }
  } catch (error) {
    console.error('Stream delete error:', error);
    throw error;
  }
}

/**
 * Cloudflare Stream 영상 정보 조회
 * @param uid 영상 UID
 */
export async function getVideoFromStream(uid: string): Promise<{
  uid: string;
  playbackUrl: string;
  thumbnailUrl: string;
  status: string;
  duration: number;
  size: number;
}> {
  try {
    const response = await fetch(`${STREAM_API_BASE}/${uid}`, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stream get failed: ${error}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Stream get failed: ${JSON.stringify(data.errors)}`);
    }

    const video = data.result;

    return {
      uid: video.uid,
      playbackUrl: `https://customer-${CLOUDFLARE_ACCOUNT_ID.substring(0, 8)}.cloudflarestream.com/${video.uid}/manifest/video.m3u8`,
      thumbnailUrl: video.thumbnail || `https://customer-${CLOUDFLARE_ACCOUNT_ID.substring(0, 8)}.cloudflarestream.com/${video.uid}/thumbnails/thumbnail.jpg`,
      status: video.status?.state || 'pending',
      duration: video.duration || 0,
      size: video.size || 0,
    };
  } catch (error) {
    console.error('Stream get error:', error);
    throw error;
  }
}

/**
 * UID에서 재생 URL 생성
 * @param uid 영상 UID
 */
export function getPlaybackUrl(uid: string): string {
  return `https://customer-${CLOUDFLARE_ACCOUNT_ID.substring(0, 8)}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
}

/**
 * UID에서 썸네일 URL 생성
 * @param uid 영상 UID
 */
export function getThumbnailUrl(uid: string): string {
  return `https://customer-${CLOUDFLARE_ACCOUNT_ID.substring(0, 8)}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg`;
}
