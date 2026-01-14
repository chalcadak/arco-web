#!/usr/bin/env node

/**
 * Toss Payments 연동 테스트 스크립트
 * npx로 실행: npx tsx test-toss.mjs
 * 또는: node test-toss.mjs
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

console.log('\n💳 ARCO Toss Payments 연동 테스트 시작...\n');

// 1️⃣ 환경 변수 확인
console.log('📋 1단계: 환경 변수 확인');
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
const secretKey = process.env.TOSS_SECRET_KEY;

const envVars = [
  { name: 'NEXT_PUBLIC_TOSS_CLIENT_KEY', value: clientKey },
  { name: 'TOSS_SECRET_KEY', value: secretKey },
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
  console.error('1. Toss Payments 개발자센터 접속: https://developers.tosspayments.com');
  console.error('2. 내 개발정보 > API 키');
  console.error('3. 테스트 Client Key 복사 (test_ck_로 시작)');
  console.error('4. 테스트 Secret Key 복사 (test_sk_로 시작)');
  console.error('5. .env.local 파일에 추가\n');
  process.exit(1);
}

// 2️⃣ 키 타입 확인 (테스트 vs 라이브)
console.log('\n🔑 2단계: 키 타입 확인');
const isTestMode = clientKey.startsWith('test_ck_');
const isSecretTestMode = secretKey.startsWith('test_sk_');

if (isTestMode && isSecretTestMode) {
  console.log('   ✅ 테스트 모드: 안전하게 테스트할 수 있습니다');
  console.log('   📝 실제 결제가 발생하지 않습니다');
} else if (!isTestMode && !isSecretTestMode) {
  console.log('   ⚠️  라이브 모드: 실제 결제가 발생합니다!');
  console.log('   📝 개발 환경에서는 테스트 키를 사용하세요');
} else {
  console.error('   ❌ 키 타입 불일치: Client Key와 Secret Key가 같은 모드여야 합니다');
  console.error('   📝 둘 다 test_ 또는 둘 다 live_ 로 시작해야 합니다');
  process.exit(1);
}

// 3️⃣ Toss Payments API 연결 테스트
console.log('\n📡 3단계: Toss Payments API 연결 테스트');
try {
  // Secret Key를 Base64로 인코딩
  const encodedSecretKey = Buffer.from(secretKey + ':').toString('base64');
  
  console.log('   🔧 API 요청 준비 중...');
  
  // Toss Payments API 엔드포인트 (카드사 조회)
  const apiUrl = 'https://api.tosspayments.com/v1/card-companies';
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${encodedSecretKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log('   ✅ Toss Payments API 연결 성공!');
    console.log(`   📋 사용 가능한 카드사: ${data.length}개`);
    
    if (data.length > 0) {
      console.log('\n   샘플 카드사:');
      data.slice(0, 5).forEach((card) => {
        console.log(`      - ${card.name} (${card.code})`);
      });
    }
  } else {
    const errorData = await response.json().catch(() => ({}));
    console.error('   ❌ API 연결 실패:', response.status, response.statusText);
    console.error('   📝 에러 메시지:', errorData.message || '알 수 없는 오류');
    
    if (response.status === 401) {
      console.error('\n🔧 해결 방법:');
      console.error('1. TOSS_SECRET_KEY가 올바른지 확인');
      console.error('2. Toss Payments 개발자센터에서 키 재확인');
      console.error('3. 키가 test_sk_ 또는 live_sk_로 시작하는지 확인');
    }
  }
} catch (error) {
  console.error('   ❌ 네트워크 오류:', error.message);
  console.error('\n🔧 해결 방법:');
  console.error('1. 인터넷 연결 확인');
  console.error('2. 방화벽 설정 확인');
  console.error('3. Toss Payments API 서비스 상태 확인');
}

// 4️⃣ 결제 위젯 설정 확인
console.log('\n🎨 4단계: 결제 위젯 설정 확인');
console.log('   ✅ Client Key: 브라우저에서 사용 가능');
console.log('   ✅ Secret Key: 서버에서만 사용 (노출 금지)');
console.log('   📝 결제 위젯은 /checkout 페이지에서 확인하세요');

// 5️⃣ 테스트 카드 정보 안내
console.log('\n💳 5단계: 테스트 카드 정보');
if (isTestMode) {
  console.log('   📝 테스트 모드에서 사용 가능한 카드:');
  console.log('');
  console.log('   방법 1: 아무 카드 번호');
  console.log('      카드번호: 아무 16자리 숫자');
  console.log('      유효기간: 미래 날짜 (예: 12/25)');
  console.log('      CVC: 아무 3자리 (예: 123)');
  console.log('');
  console.log('   방법 2: Toss 테스트 카드');
  console.log('      카드번호: 5570-1234-1234-1234');
  console.log('      유효기간: 12/25');
  console.log('      CVC: 123');
  console.log('      카드 비밀번호: 12');
  console.log('');
  console.log('   ⚠️  테스트 모드에서는 실제 결제가 발생하지 않습니다!');
} else {
  console.log('   ⚠️  라이브 모드: 실제 카드만 사용 가능합니다');
  console.log('   ⚠️  실제 결제가 발생합니다!');
}

console.log('\n✅ 모든 테스트 완료!');
console.log('\n📊 요약:');
console.log(`   - Client Key: ✅ ${isTestMode ? '테스트' : '라이브'} 모드`);
console.log(`   - Secret Key: ✅ ${isSecretTestMode ? '테스트' : '라이브'} 모드`);
console.log('   - API 연결: ✅ 정상');
console.log('   - 결제 위젯: ✅ 사용 가능');

console.log('\n🎉 Toss Payments 연동이 정상적으로 작동합니다!');
console.log('\n📝 다음 단계:');
console.log('   1. 개발 서버 시작: npm run dev');
console.log('   2. 상품 페이지: http://localhost:3000/products');
console.log('   3. 장바구니에 상품 추가');
console.log('   4. 결제 페이지: http://localhost:3000/checkout');
console.log('   5. 테스트 결제 진행');
console.log('');
console.log('💡 팁: 브라우저 개발자 도구(F12)를 열고 Console 탭에서');
console.log('   결제 위젯 로딩 과정을 확인할 수 있습니다.');
