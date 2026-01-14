/**
 * React Hook: 미디어 업로드
 * 
 * 프론트엔드에서 간편하게 파일을 업로드할 수 있는 훅입니다.
 */

'use client';

import { useState, useCallback } from 'react';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface UploadResult {
  success: boolean;
  type: 'image' | 'video';
  data?: {
    url?: string;
    key?: string;
    uid?: string;
    playbackUrl?: string;
    thumbnailUrl?: string;
  };
  error?: string;
}

/**
 * 미디어 업로드 훅
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { upload, isUploading, progress, error } = useMediaUpload();
 *   
 *   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (!file) return;
 *     
 *     const result = await upload(file, 'products');
 *     
 *     if (result.success && result.type === 'image') {
 *       console.log('Image URL:', result.data?.url);
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <input type="file" onChange={handleFileChange} disabled={isUploading} />
 *       {isUploading && <p>Uploading... {progress}%</p>}
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const upload = useCallback(async (
    file: File,
    folder?: string
  ): Promise<UploadResult> => {
    setState({ isUploading: true, progress: 0, error: null });

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      // 업로드 (XMLHttpRequest로 진행률 추적)
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 진행률 추적
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setState(prev => ({ ...prev, progress }));
          }
        });

        // 완료
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });

        // 에러
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        // 요청
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      setState({ isUploading: false, progress: 100, error: null });
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState({ isUploading: false, progress: 0, error: errorMessage });
      
      return {
        success: false,
        type: 'image',
        error: errorMessage,
      };
    }
  }, []);

  const uploadMultiple = useCallback(async (
    files: File[],
    folder?: string
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await upload(file, folder);
      results.push(result);
    }
    
    return results;
  }, [upload]);

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    upload,
    uploadMultiple,
    reset,
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
  };
}

/**
 * 드래그 앤 드롭 업로드 훅
 */
export function useDragAndDropUpload(
  onUpload: (files: File[]) => void | Promise<void>
) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await onUpload(files);
    }
  }, [onUpload]);

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}
