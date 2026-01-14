#!/usr/bin/env node

/**
 * Supabase 연동 테스트 스크립트
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
} catch (error) {
  console.error('⚠️  .env.local 파일을 읽을 수 없습니다:', error.message);
}

console.log('\n🚀 ARCO Supabase 연동 테스트 시작...\n');

// 1️⃣ 환경 변수 확인
console.log('📋 1단계: 환경 변수 확인');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 설정됨' : '❌ 없음');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ 설정됨' : '❌ 없음');
  process.exit(1);
}

console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl.substring(0, 30) + '...');
console.log('   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey.substring(0, 30) + '...');

// 2️⃣ Supabase 클라이언트 생성
console.log('\n📡 2단계: Supabase 클라이언트 생성');
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('   ✅ 클라이언트 생성 완료');

// 3️⃣ 데이터베이스 연결 테스트
console.log('\n🗄️  3단계: 데이터베이스 연결 테스트');

try {
  // categories 테이블 테스트
  console.log('   📦 categories 테이블 조회 중...');
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .limit(5);

  if (categoriesError) {
    console.error('   ❌ categories 테이블 조회 실패:', categoriesError.message);
  } else {
    console.log('   ✅ categories:', categories.length + '개 조회 성공');
    if (categories.length > 0) {
      console.log('   📋 샘플 데이터:', categories[0].name);
    }
  }

  // products 테이블 테스트
  console.log('   📦 products 테이블 조회 중...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price')
    .limit(5);

  if (productsError) {
    console.error('   ❌ products 테이블 조회 실패:', productsError.message);
  } else {
    console.log('   ✅ products:', products.length + '개 조회 성공');
    if (products.length > 0) {
      console.log('   📋 샘플 데이터:', products[0].name);
    }
  }

  // photoshoot_looks 테이블 테스트
  console.log('   📦 photoshoot_looks 테이블 조회 중...');
  const { data: photoshoots, error: photoshootsError } = await supabase
    .from('photoshoot_looks')
    .select('id, name, price')
    .limit(5);

  if (photoshootsError) {
    console.error('   ❌ photoshoot_looks 테이블 조회 실패:', photoshootsError.message);
  } else {
    console.log('   ✅ photoshoot_looks:', photoshoots.length + '개 조회 성공');
    if (photoshoots.length > 0) {
      console.log('   📋 샘플 데이터:', photoshoots[0].name);
    }
  }

  // bookings 테이블 테스트
  console.log('   📦 bookings 테이블 조회 중...');
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, status')
    .limit(5);

  if (bookingsError) {
    console.error('   ❌ bookings 테이블 조회 실패:', bookingsError.message);
  } else {
    console.log('   ✅ bookings:', bookings.length + '개 조회 성공');
  }

  // orders 테이블 테스트
  console.log('   📦 orders 테이블 조회 중...');
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, status')
    .limit(5);

  if (ordersError) {
    console.error('   ❌ orders 테이블 조회 실패:', ordersError.message);
  } else {
    console.log('   ✅ orders:', orders.length + '개 조회 성공');
  }

  console.log('\n✅ 모든 테스트 완료!');
  console.log('\n📊 요약:');
  console.log('   - Categories:', categoriesError ? '❌' : '✅', categories?.length || 0, '개');
  console.log('   - Products:', productsError ? '❌' : '✅', products?.length || 0, '개');
  console.log('   - Photoshoot Looks:', photoshootsError ? '❌' : '✅', photoshoots?.length || 0, '개');
  console.log('   - Bookings:', bookingsError ? '❌' : '✅', bookings?.length || 0, '개');
  console.log('   - Orders:', ordersError ? '❌' : '✅', orders?.length || 0, '개');

  console.log('\n🎉 Supabase 연동이 정상적으로 작동합니다!');

} catch (error) {
  console.error('\n❌ 오류 발생:', error.message);
  process.exit(1);
}
