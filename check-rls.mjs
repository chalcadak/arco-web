#!/usr/bin/env node

/**
 * Supabase RLS 상태 확인 스크립트
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

console.log('\n🔍 ARCO RLS 상태 확인...\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('📋 RLS 활성화 상태 확인...\n');

// RLS 상태 확인
const { data: rlsStatus, error: rlsError } = await supabase
  .rpc('exec_sql', {
    sql: `
      SELECT 
        tablename,
        rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename IN ('categories', 'products', 'photoshoot_looks', 'bookings', 'orders')
      ORDER BY tablename;
    `
  });

if (rlsError) {
  console.log('⚠️  RPC 방식 실패, 직접 쿼리 시도...\n');
  
  // 직접 SQL 쿼리로 RLS 상태 확인
  const { data: tables, error: tablesError } = await supabase
    .from('pg_tables')
    .select('tablename, rowsecurity')
    .eq('schemaname', 'public')
    .in('tablename', ['categories', 'products', 'photoshoot_looks', 'bookings', 'orders']);
  
  if (tablesError) {
    console.error('❌ RLS 상태 확인 실패:', tablesError.message);
  } else {
    console.log('📊 테이블별 RLS 상태:\n');
    tables?.forEach(table => {
      console.log(`   ${table.rls_enabled ? '✅' : '❌'} ${table.tablename}: RLS ${table.rls_enabled ? 'ENABLED' : 'DISABLED'}`);
    });
  }
} else {
  console.log('📊 테이블별 RLS 상태:\n');
  rlsStatus?.forEach(table => {
    console.log(`   ${table.rls_enabled ? '✅' : '❌'} ${table.tablename}: RLS ${table.rls_enabled ? 'ENABLED' : 'DISABLED'}`);
  });
}

console.log('\n📋 정책(Policy) 확인...\n');

// 정책 확인
const { data: policies, error: policiesError } = await supabase
  .rpc('exec_sql', {
    sql: `
      SELECT 
        schemaname,
        tablename,
        policyname
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `
  });

if (policiesError) {
  console.log('⚠️  정책 확인 실패 (pg_policies 접근 불가)\n');
} else if (policies && policies.length > 0) {
  console.log('📊 적용된 정책:\n');
  let currentTable = '';
  policies.forEach(policy => {
    if (policy.tablename !== currentTable) {
      currentTable = policy.tablename;
      console.log(`\n   📦 ${policy.tablename}:`);
    }
    console.log(`      • ${policy.policyname}`);
  });
} else {
  console.log('⚠️  적용된 정책이 없습니다!\n');
}

console.log('\n✅ 확인 완료!\n');
