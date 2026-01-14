#!/usr/bin/env node

/**
 * ARCO Admin Test Account Setup Script
 * 
 * 이 스크립트는 테스트용 관리자 계정을 생성합니다.
 * 
 * 사용법:
 * 1. .env.local 파일이 있는지 확인
 * 2. node scripts/create-test-admin.mjs 실행
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('❌ .env.local 파일을 찾을 수 없습니다.');
  process.exit(1);
}

// Test admin credentials
const TEST_ADMIN = {
  email: 'admin@arco.com',
  password: 'Admin123!@#',
  name: 'ARCO 관리자',
};

console.log('🚀 ARCO 테스트 관리자 계정 생성 시작...\n');

// Check environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestAdmin() {
  try {
    console.log('📧 이메일:', TEST_ADMIN.email);
    console.log('🔑 비밀번호:', TEST_ADMIN.password);
    console.log('');

    // Step 1: Check if user already exists
    console.log('1️⃣ 기존 계정 확인 중...');
    const { data: existingUser } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', TEST_ADMIN.email)
      .single();

    if (existingUser) {
      console.log('   ⚠️  계정이 이미 존재합니다:', existingUser.email);
      console.log('   현재 역할:', existingUser.role);
      
      if (existingUser.role === 'admin') {
        console.log('   ✅ 이미 관리자 계정입니다!');
        return;
      }

      // Promote existing user
      console.log('   🔄 관리자 권한 부여 중...');
      const { error: promoteError } = await supabase.rpc('promote_to_admin', {
        user_email: TEST_ADMIN.email,
      });

      if (promoteError) {
        console.error('   ❌ 권한 부여 실패:', promoteError.message);
        process.exit(1);
      }

      console.log('   ✅ 관리자 권한 부여 완료!');
      return;
    }

    // Step 2: Create new user
    console.log('2️⃣ 새 계정 생성 중...');
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: TEST_ADMIN.name,
      },
    });

    if (signUpError) {
      console.error('   ❌ 계정 생성 실패:', signUpError.message);
      process.exit(1);
    }

    if (!authData.user) {
      console.error('   ❌ 사용자 데이터를 받지 못했습니다.');
      process.exit(1);
    }

    console.log('   ✅ Auth 계정 생성 완료!');
    console.log('   User ID:', authData.user.id);

    // Step 3: Insert into users table
    console.log('3️⃣ users 테이블에 추가 중...');
    const { error: usersError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: TEST_ADMIN.email,
        name: TEST_ADMIN.name,
        role: 'admin',
      });

    if (usersError) {
      console.error('   ⚠️  users 테이블 추가 실패:', usersError.message);
      console.log('   (이미 존재할 수 있음)');
    } else {
      console.log('   ✅ users 테이블 추가 완료!');
    }

    // Step 4: Insert into profiles table (if exists)
    console.log('4️⃣ profiles 테이블에 추가 중...');
    const { error: profilesError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: TEST_ADMIN.email,
        full_name: TEST_ADMIN.name,
        role: 'admin',
      });

    if (profilesError) {
      console.error('   ⚠️  profiles 테이블 추가 실패:', profilesError.message);
      console.log('   (테이블이 없거나 이미 존재할 수 있음)');
    } else {
      console.log('   ✅ profiles 테이블 추가 완료!');
    }

    // Step 5: Verify admin role
    console.log('5️⃣ 관리자 권한 확인 중...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', TEST_ADMIN.email)
      .single();

    if (verifyError) {
      console.error('   ❌ 확인 실패:', verifyError.message);
    } else {
      console.log('   ✅ 확인 완료!');
      console.log('   Email:', verifyData.email);
      console.log('   Role:', verifyData.role);
    }

    console.log('\n🎉 테스트 관리자 계정 생성 완료!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 이메일:', TEST_ADMIN.email);
    console.log('🔑 비밀번호:', TEST_ADMIN.password);
    console.log('🔗 로그인 URL: http://localhost:3000/admin/login');
    console.log('═══════════════════════════════════════\n');
    console.log('⚠️  주의: 이 계정은 테스트용입니다.');
    console.log('   프로덕션 배포 전에 비밀번호를 변경하거나 계정을 삭제하세요.\n');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

// Run the script
createTestAdmin();
