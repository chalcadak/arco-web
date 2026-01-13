'use client';

import { useState } from 'react';
import { X, Upload, Video, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VideoUploadProps {
  video: string | null; // UID 또는 playback URL
  onVideoChange: (uid: string | null) => void;
}

export default function VideoUpload({
  video,
  onVideoChange,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<{
    uid: string;
    playbackUrl: string;
    thumbnailUrl: string;
    status: string;
  } | null>(null);

  // 파일 업로드 처리
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 진행 상태 시뮬레이션 (실제로는 XMLHttpRequest 사용 필요)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setVideoInfo(data.video);
      onVideoChange(data.video.uid);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert('영상 업로드에 실패했습니다.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // 영상 삭제
  const handleRemoveVideo = async () => {
    if (!videoInfo) return;

    try {
      await fetch(`/api/upload-video?uid=${videoInfo.uid}`, {
        method: 'DELETE',
      });

      setVideoInfo(null);
      onVideoChange(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert('영상 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      {!videoInfo && !isUploading && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
            className="hidden"
            id="video-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="font-medium mb-1">영상을 업로드하세요</p>
              <p className="text-sm text-muted-foreground">
                MP4, MOV, AVI, MKV, WebM (최대 200MB)
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              영상 선택
            </Button>
          </div>
        </div>
      )}

      {isUploading && (
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <div className="flex-1">
                <p className="font-medium">영상 업로드 중...</p>
                <p className="text-sm text-muted-foreground">
                  {uploadProgress}% 완료
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              영상이 처리되는 동안 잠시만 기다려주세요.
            </p>
          </div>
        </Card>
      )}

      {videoInfo && !isUploading && (
        <Card className="overflow-hidden">
          <div className="relative">
            {/* 영상 썸네일 */}
            <div className="aspect-video bg-black relative">
              <img
                src={videoInfo.thumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="h-16 w-16 text-white opacity-80" />
              </div>
            </div>

            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
              aria-label="영상 삭제"
            >
              <X className="h-4 w-4" />
            </button>

            {/* 상태 표시 */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
              {videoInfo.status === 'ready' && '✓ 업로드 완료'}
              {videoInfo.status === 'queued' && '⏳ 처리 대기 중'}
              {videoInfo.status === 'inprogress' && '⚙️ 처리 중'}
              {videoInfo.status === 'error' && '❌ 오류'}
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              영상이 업로드되었습니다. 고객은 상세 페이지에서 재생할 수 있습니다.
            </p>
          </div>
        </Card>
      )}

      {video && !videoInfo && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            기존 영상이 있습니다. UID: {video}
          </p>
        </Card>
      )}
    </div>
  );
}
