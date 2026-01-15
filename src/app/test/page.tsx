/**
 * 로컬 테스트 페이지
 * 
 * 접속: /test
 */

'use client';

import { useState, useEffect } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  const [envData, setEnvData] = useState<any>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const { upload, isUploading, progress, error } = useMediaUpload();
  const [uploadResult, setUploadResult] = useState<any>(null);

  // 환경 변수 확인
  useEffect(() => {
    fetch('/api/test-env')
      .then(res => res.json())
      .then(data => {
        setEnvData(data);
        setEnvLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch env:', err);
        setEnvLoading(false);
      });
  }, []);

  // 파일 업로드 테스트
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadResult(null);
    const result = await upload(file, 'test');
    setUploadResult(result);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🧪 ARCO 로컬 테스트</h1>

      {/* 환경 변수 확인 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1️⃣ 환경 변수 확인</CardTitle>
        </CardHeader>
        <CardContent>
          {envLoading ? (
            <p>로딩 중...</p>
          ) : envData?.success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="font-semibold text-green-900 mb-2">✅ 환경 설정 정상</div>
                <div className="space-y-1 text-sm">
                  <div><strong>환경:</strong> {envData.environment}</div>
                  <div><strong>개발 모드:</strong> {envData.isDevelopment ? '✅' : '❌'}</div>
                  <div><strong>운영 모드:</strong> {envData.isProduction ? '✅' : '❌'}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Supabase */}
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Supabase</h3>
                  <div className="space-y-1 text-sm">
                    <div>URL: {envData.config.supabase.url}</div>
                    <div>Anon Key: {envData.config.supabase.hasAnonKey ? '✅' : '❌'}</div>
                    <div>Service Role: {envData.config.supabase.hasServiceRoleKey ? '✅' : '❌'}</div>
                  </div>
                </div>

                {/* R2 */}
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Cloudflare R2</h3>
                  <div className="space-y-1 text-sm">
                    <div>Bucket: {envData.config.r2.bucketName}</div>
                    <div>Access Key: {envData.config.r2.hasAccessKey ? '✅' : '❌'}</div>
                    <div>Secret Key: {envData.config.r2.hasSecretKey ? '✅' : '❌'}</div>
                  </div>
                </div>

                {/* Stream */}
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Cloudflare Stream</h3>
                  <div className="space-y-1 text-sm">
                    <div>Account: {envData.config.stream.accountId}</div>
                    <div>API Token: {envData.config.stream.hasApiToken ? '✅' : '❌'}</div>
                  </div>
                </div>

                {/* App */}
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">App</h3>
                  <div className="space-y-1 text-sm">
                    <div>URL: {envData.config.app.url}</div>
                    <div>Admin: {envData.config.app.adminEmail}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-900">
              ❌ 환경 설정 오류: {envData?.error || '알 수 없는 오류'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 파일 업로드 테스트 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2️⃣ 파일 업로드 테스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-2">
                이미지는 R2로, 동영상은 Stream으로 자동 업로드됩니다
              </p>
            </div>

            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="font-semibold text-blue-900 mb-2">
                  업로드 중... {progress}%
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 text-red-900">
                ❌ 업로드 실패: {error}
              </div>
            )}

            {uploadResult && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="font-semibold text-green-900 mb-2">
                  ✅ 업로드 성공!
                </div>
                <pre className="text-xs overflow-auto p-2 bg-white rounded">
                  {JSON.stringify(uploadResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 빠른 링크 */}
      <Card>
        <CardHeader>
          <CardTitle>3️⃣ 빠른 링크</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/login"
              className="block p-4 border rounded hover:bg-gray-50 transition"
            >
              <div className="font-semibold">🔐 관리자 로그인</div>
              <div className="text-sm text-gray-600">admin@arco.com</div>
            </a>

            <a
              href="/admin/dashboard"
              className="block p-4 border rounded hover:bg-gray-50 transition"
            >
              <div className="font-semibold">📊 관리자 대시보드</div>
              <div className="text-sm text-gray-600">AI 추천 확인</div>
            </a>

            <a
              href="/products"
              className="block p-4 border rounded hover:bg-gray-50 transition"
            >
              <div className="font-semibold">🛍️ 상품 목록</div>
              <div className="text-sm text-gray-600">퀵 바이 테스트</div>
            </a>

            <a
              href="/"
              className="block p-4 border rounded hover:bg-gray-50 transition"
            >
              <div className="font-semibold">🏠 메인 페이지</div>
              <div className="text-sm text-gray-600">개인화 피드 확인</div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
