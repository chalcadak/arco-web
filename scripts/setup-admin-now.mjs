#!/usr/bin/env node

/**
 * ARCO Admin Test Account Setup Script
 * Direct execution version
 */

import { createClient } from '@supabase/supabase-js';

// Direct configuration
const SUPABASE_URL = 'https://uuiresymwsjpamntmkyb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA2NjAzOCwiZXhwIjoyMDgzNjQyMDM4fQ.VDprvHpAkjAyjZk8uWcD6ofdp0e8-_edYdSec4b_zK0';

// Test admin credentials
const TEST_ADMIN = {
  email: 'admin@arco.com',
  password: 'Admin123!@#',
  name: 'ARCO 관리자',
};

console.log('🚀 ARCO 테스트 관리자 계정 생성 시작...\n');
console.log('📧 이메일:', TEST_ADMIN.email);
console.log('🔑 비밀번호:', TEST_ADMIN.password);
console.log('');

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestAdmin() {
  try {
    // Step 1: Check if user already exists in auth
    console.log('1️⃣ 기존 계정 확인 중...');
    
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('   ⚠️  사용자 목록 조회 실패:', listError.message);
    }
    
    const existingAuthUser = users?.find(u => u.email === TEST_ADMIN.email);
    
    if (existingAuthUser) {
      console.log('   ⚠️  Auth 계정이 이미 존재합니다:', existingAuthUser.email);
      console.log('   User ID:', existingAuthUser.id);
      
      // Check role in users table
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', existingAuthUser.id)
        .single();
      
      if (userData?.role === 'admin') {
        console.log('   ✅ 이미 관리자 계정입니다!');
        console.log('\n═══════════════════════════════════════');
        console.log('📧 이메일:', TEST_ADMIN.email);
        console.log('🔑 비밀번호:', TEST_ADMIN.password);
        console.log('🔗 로그인 URL: http://localhost:3000/admin/login');
        console.log('═══════════════════════════════════════\n');
        return;
      }
      
      console.log('   🔄 관리자 권한 부여 중...');
      
      // Update users table
      await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', existingAuthUser.id);
      
      // Update profiles table
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', existingAuthUser.id);
      
      console.log('   ✅ 관리자 권한 부여 완료!');
      console.log('\n═══════════════════════════════════════');
      console.log('📧 이메일:', TEST_ADMIN.email);
      console.log('🔑 비밀번호:', TEST_ADMIN.password);
      console.log('🔗 로그인 URL: http://localhost:3000/admin/login');
      console.log('═══════════════════════════════════════\n');
      return;
    }

    // Step 2: Create new user
    console.log('2️⃣ 새 계정 생성 중...');
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
      email_confirm: true,
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
      console.error('   ⚠️  users 테이블 추가:', usersError.message);
    } else {
      console.log('   ✅ users 테이블 추가 완료!');
    }

    // Step 4: Insert into profiles table
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
      console.error('   ⚠️  profiles 테이블 추가:', profilesError.message);
    } else {
      console.log('   ✅ profiles 테이블 추가 완료!');
    }

    // Step 5: Verify
    console.log('5️⃣ 관리자 권한 확인 중...');
    const { data: verifyData } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', TEST_ADMIN.email)
      .single();

    if (verifyData) {
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

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

// Run
createTestAdmin();
