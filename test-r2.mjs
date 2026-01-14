#!/usr/bin/env node

/**
 * Cloudflare R2 연동 테스트 스크립트
 * npx로 실행: npx tsx test-r2.mjs
 * 또는: node test-r2.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 수동 파싱
const envPath = resolve(__dirname, '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
} catch (error) {
  console.error('⚠️  .env.local 파일을 읽을 수 없습니다:', error.message);
}

console.log('\n🚀 ARCO Cloudflare R2 연동 테스트 시작...\n');

// 1️⃣ 환경 변수 확인
console.log('📋 1단계: 환경 변수 확인');
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

const envVars = [
  { name: 'CLOUDFLARE_ACCOUNT_ID', value: accountId },
  { name: 'CLOUDFLARE_R2_ACCESS_KEY_ID', value: accessKeyId },
  { name: 'CLOUDFLARE_R2_SECRET_ACCESS_KEY', value: secretAccessKey },
  { name: 'CLOUDFLARE_R2_BUCKET_NAME', value: bucketName },
  { name: 'CLOUDFLARE_R2_PUBLIC_URL', value: publicUrl },
];

let allEnvVarsPresent = true;
envVars.forEach(({ name, value }) => {
  if (!value) {
    console.error(`   ❌ ${name}: 없음`);
    allEnvVarsPresent = false;
  } else {
    console.log(`   ✅ ${name}: ${value.substring(0, 30)}...`);
  }
});

if (!allEnvVarsPresent) {
  console.error('\n❌ 환경 변수가 설정되지 않았습니다!');
  console.error('\n📝 설정 방법:');
  console.error('1. Cloudflare 대시보드 접속: https://dash.cloudflare.com');
  console.error('2. R2 > Manage R2 API Tokens');
  console.error('3. Create API Token 클릭');
  console.error('4. 권한: Object Read & Write, Admin Read & Write');
  console.error('5. Access Key ID와 Secret Access Key 복사');
  console.error('6. .env.local 파일에 추가\n');
  process.exit(1);
}

console.log('\n📡 2단계: AWS SDK 모듈 확인');
try {
  const { S3Client, PutObjectCommand, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
  console.log('   ✅ AWS SDK 모듈 로드 완료');

  // 2️⃣ S3 클라이언트 생성
  console.log('\n🔧 3단계: R2 클라이언트 생성');
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
  console.log('   ✅ R2 클라이언트 생성 완료');

  // 3️⃣ 버킷 목록 조회 테스트
  console.log('\n📦 4단계: 버킷 접근 테스트');
  let listResponse;
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 5,
    });
    listResponse = await s3Client.send(listCommand);
    
    console.log('   ✅ 버킷 접근 성공!');
    console.log(`   📋 버킷 이름: ${bucketName}`);
    
    if (listResponse.Contents && listResponse.Contents.length > 0) {
      console.log(`   📁 저장된 파일: ${listResponse.Contents.length}개`);
      console.log('\n   샘플 파일:');
      listResponse.Contents.slice(0, 3).forEach((file) => {
        console.log(`      - ${file.Key} (${Math.round(file.Size / 1024)}KB)`);
      });
    } else {
      console.log('   📁 저장된 파일: 0개 (버킷이 비어있음)');
    }
  } catch (error) {
    console.error('   ❌ 버킷 접근 실패:', error.message);
    console.error('\n🔧 해결 방법:');
    console.error('1. Cloudflare 대시보드에서 버킷 이름 확인');
    console.error('2. API 토큰 권한 확인 (Object Read & Write 필요)');
    console.error('3. Account ID 확인');
    throw error;
  }

  // 4️⃣ 테스트 파일 업로드 (선택사항)
  console.log('\n📤 5단계: 테스트 파일 업로드 (선택사항)');
  console.log('   ℹ️  실제 업로드는 관리자 페이지에서 진행하세요');
  console.log('   📝 테스트 파일 업로드를 원하시면 이미지를 준비하세요');

  // 5️⃣ Public URL 확인
  console.log('\n🌐 6단계: Public URL 확인');
  if (publicUrl) {
    console.log(`   ✅ Public URL: ${publicUrl}`);
    console.log('   📝 업로드된 이미지는 이 URL로 접근 가능합니다');
    
    if (listResponse.Contents && listResponse.Contents.length > 0) {
      const sampleFile = listResponse.Contents[0].Key;
      const sampleUrl = `${publicUrl}/${sampleFile}`;
      console.log(`\n   🖼️  샘플 이미지 URL:`);
      console.log(`   ${sampleUrl}`);
    }
  } else {
    console.log('   ⚠️  Public URL이 설정되지 않았습니다');
    console.log('   📝 Cloudflare 대시보드에서 Public Access 활성화 필요');
  }

  console.log('\n✅ 모든 테스트 완료!');
  console.log('\n📊 요약:');
  console.log('   - 환경 변수: ✅ 정상');
  console.log('   - AWS SDK: ✅ 로드됨');
  console.log('   - R2 클라이언트: ✅ 생성됨');
  console.log('   - 버킷 접근: ✅ 성공');
  console.log(`   - 저장된 파일: ${listResponse.Contents?.length || 0}개`);
  console.log('   - Public URL: ✅ 설정됨');

  console.log('\n🎉 Cloudflare R2 연동이 정상적으로 작동합니다!');
  console.log('\n📝 다음 단계:');
  console.log('   1. 개발 서버 시작: npm run dev');
  console.log('   2. 관리자 로그인: http://localhost:3000/admin/login');
  console.log('   3. 상품 등록: http://localhost:3000/admin/products/new');
  console.log('   4. 이미지 업로드 테스트');

} catch (error) {
  if (error.code === 'ERR_MODULE_NOT_FOUND') {
    console.error('\n❌ AWS SDK가 설치되지 않았습니다!');
    console.error('\n📝 설치 방법:');
    console.error('   npm install');
    console.error('\n   또는 직접 설치:');
    console.error('   npm install @aws-sdk/client-s3 @aws-sdk/lib-storage @aws-sdk/s3-request-presigner');
  } else {
    console.error('\n❌ 오류 발생:', error.message);
    console.error('\n🔍 상세 정보:', error);
  }
  process.exit(1);
}
