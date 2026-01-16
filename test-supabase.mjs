#!/usr/bin/env node

/**
 * Supabase 연동 테스트 스크립트 (SERVICE_ROLE_KEY 사용)
 * 
 * SERVICE_ROLE_KEY를 사용하여 RLS(Row Level Security)를 우회하고
 * 데이터베이스의 모든 데이터에 접근할 수 있습니다.
 * 
 * npx로 실행: npx tsx test-supabase.mjs
 * 또는: node test-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
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
  console.log('✅ .env.local 파일 로드 완료\n');
} catch (error) {
  console.error('⚠️  .env.local 파일을 읽을 수 없습니다:', error.message);
  console.log('💡 Tip: .env.local 파일이 프로젝트 루트에 있는지 확인하세요.\n');
}

console.log('🚀 ARCO Supabase 연동 테스트 시작...\n');
console.log('🔐 테스트 모드: SERVICE_ROLE_KEY 사용 (RLS 우회)\n');

// 1️⃣ 환경 변수 확인
console.log('📋 1단계: 환경 변수 확인');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다!');
  process.exit(1);
}

if (!supabaseServiceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다!');
  console.error('💡 Tip: .env.local 파일에 다음을 추가하세요:');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n');
  
  if (supabaseAnonKey) {
    console.log('⚠️  ANON_KEY는 있지만 SERVICE_ROLE_KEY가 없습니다.');
    console.log('   테스트를 위해 SERVICE_ROLE_KEY를 추가해주세요.\n');
  }
  process.exit(1);
}

console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl.substring(0, 40) + '...');
console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey.substring(0, 40) + '...');
console.log('   🔑 Using SERVICE_ROLE_KEY (bypasses RLS for testing)\n');

// 2️⃣ Supabase 클라이언트 생성
console.log('📡 2단계: Supabase 클라이언트 생성');
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});
console.log('   ✅ 클라이언트 생성 완료 (SERVICE_ROLE_KEY 사용)\n');

// 3️⃣ 데이터베이스 연결 테스트
console.log('🗄️  3단계: 데이터베이스 연결 테스트\n');

const testResults = {
  categories: { success: false, count: 0, error: null },
  products: { success: false, count: 0, error: null },
  photoshoot_looks: { success: false, count: 0, error: null },
  bookings: { success: false, count: 0, error: null },
  orders: { success: false, count: 0, error: null }
};

try {
  // categories 테이블 테스트
  console.log('📦 categories 테이블 조회 중...');
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .limit(10);

  if (categoriesError) {
    console.error('   ❌ categories 테이블 조회 실패:', categoriesError.message);
    console.error('   📝 에러 코드:', categoriesError.code);
    console.error('   📝 에러 상세:', categoriesError.details);
    testResults.categories.error = categoriesError.message;
  } else {
    console.log('   ✅ categories:', categories.length + '개 조회 성공');
    testResults.categories.success = true;
    testResults.categories.count = categories.length;
    if (categories.length > 0) {
      console.log('   📋 샘플 데이터:');
      categories.slice(0, 3).forEach(cat => {
        console.log(`      • ${cat.name} (${cat.slug})`);
      });
    } else {
      console.log('   ⚠️  데이터가 없습니다. 마이그레이션을 실행하셨나요?');
    }
  }
  console.log('');

  // products 테이블 테스트
  console.log('📦 products 테이블 조회 중...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, category_id')
    .limit(10);

  if (productsError) {
    console.error('   ❌ products 테이블 조회 실패:', productsError.message);
    console.error('   📝 에러 코드:', productsError.code);
    testResults.products.error = productsError.message;
  } else {
    console.log('   ✅ products:', products.length + '개 조회 성공');
    testResults.products.success = true;
    testResults.products.count = products.length;
    if (products.length > 0) {
      console.log('   📋 샘플 데이터:');
      products.slice(0, 3).forEach(prod => {
        console.log(`      • ${prod.name} (₩${prod.price?.toLocaleString() || 'N/A'})`);
      });
    } else {
      console.log('   ⚠️  제품 데이터가 없습니다.');
    }
  }
  console.log('');

  // photoshoot_looks 테이블 테스트
  console.log('📦 photoshoot_looks 테이블 조회 중...');
  const { data: photoshoots, error: photoshootsError } = await supabase
    .from('photoshoot_looks')
    .select('id, name, price, category_id')
    .limit(10);

  if (photoshootsError) {
    console.error('   ❌ photoshoot_looks 테이블 조회 실패:', photoshootsError.message);
    console.error('   📝 에러 코드:', photoshootsError.code);
    testResults.photoshoot_looks.error = photoshootsError.message;
  } else {
    console.log('   ✅ photoshoot_looks:', photoshoots.length + '개 조회 성공');
    testResults.photoshoot_looks.success = true;
    testResults.photoshoot_looks.count = photoshoots.length;
    if (photoshoots.length > 0) {
      console.log('   📋 샘플 데이터:');
      photoshoots.slice(0, 3).forEach(look => {
        console.log(`      • ${look.name} (₩${look.price?.toLocaleString() || 'N/A'})`);
      });
    } else {
      console.log('   ⚠️  촬영룩 데이터가 없습니다.');
    }
  }
  console.log('');

  // bookings 테이블 테스트
  console.log('📦 bookings 테이블 조회 중...');
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, status, customer_name, preferred_date')
    .limit(10);

  if (bookingsError) {
    console.error('   ❌ bookings 테이블 조회 실패:', bookingsError.message);
    console.error('   📝 에러 코드:', bookingsError.code);
    testResults.bookings.error = bookingsError.message;
  } else {
    console.log('   ✅ bookings:', bookings.length + '개 조회 성공');
    testResults.bookings.success = true;
    testResults.bookings.count = bookings.length;
    if (bookings.length > 0) {
      console.log('   📋 샘플 데이터:');
      bookings.slice(0, 3).forEach(booking => {
        console.log(`      • ${booking.customer_name} - ${booking.status} (${booking.preferred_date})`);
      });
    } else {
      console.log('   ℹ️  예약 데이터가 없습니다 (정상 - 아직 예약이 없을 수 있음).');
    }
  }
  console.log('');

  // orders 테이블 테스트
  console.log('📦 orders 테이블 조회 중...');
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, order_number, status, customer_name, total_amount')
    .limit(10);

  if (ordersError) {
    console.error('   ❌ orders 테이블 조회 실패:', ordersError.message);
    console.error('   📝 에러 코드:', ordersError.code);
    testResults.orders.error = ordersError.message;
  } else {
    console.log('   ✅ orders:', orders.length + '개 조회 성공');
    testResults.orders.success = true;
    testResults.orders.count = orders.length;
    if (orders.length > 0) {
      console.log('   📋 샘플 데이터:');
      orders.slice(0, 3).forEach(order => {
        console.log(`      • ${order.order_number} - ${order.customer_name} (₩${order.total_amount?.toLocaleString()})`);
      });
    } else {
      console.log('   ℹ️  주문 데이터가 없습니다 (정상 - 아직 주문이 없을 수 있음).');
    }
  }

  // 요약
  console.log('\n' + '='.repeat(60));
  console.log('📊 테스트 요약\n');
  
  const successCount = Object.values(testResults).filter(r => r.success).length;
  const totalCount = Object.keys(testResults).length;
  
  console.log(`전체: ${successCount}/${totalCount} 테이블 조회 성공\n`);
  
  Object.entries(testResults).forEach(([table, result]) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? `${result.count}개 조회 성공` : `실패: ${result.error}`;
    console.log(`${icon} ${table.padEnd(20)} ${status}`);
  });

  console.log('\n' + '='.repeat(60));

  // 결론
  if (successCount === totalCount) {
    console.log('\n🎉 모든 테이블 조회 성공! Supabase 연동이 정상적으로 작동합니다!\n');
  } else if (successCount > 0) {
    console.log('\n⚠️  일부 테이블 조회 실패. RLS 정책을 확인하세요.\n');
    console.log('💡 다음 명령어로 RLS 마이그레이션을 실행하세요:');
    console.log('   npx supabase db push --include-all\n');
  } else {
    console.log('\n❌ 모든 테이블 조회 실패! 다음을 확인하세요:\n');
    console.log('1. 마이그레이션 실행 여부:');
    console.log('   npx supabase db push --include-all\n');
    console.log('2. Supabase 프로젝트가 정상 작동 중인지 확인:');
    console.log('   ' + supabaseUrl + '\n');
    console.log('3. SERVICE_ROLE_KEY가 올바른지 확인\n');
  }

} catch (error) {
  console.error('\n❌ 예상치 못한 오류 발생:', error.message);
  console.error('스택 트레이스:', error.stack);
  process.exit(1);
}
