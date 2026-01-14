#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const SUPABASE_URL = 'https://uuiresymwsjpamntmkyb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjYwMzgsImV4cCI6MjA4MzY0MjAzOH0.VrxrjbBvMg8PvpvswvWxlAQj75YVBlvFdkd1ULz19TU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_EMAIL = 'admin@arco.com';
const ADMIN_PASSWORD = 'Admin123!@#';
const ADMIN_NAME = 'ARCO 관리자';

console.log('🚀 ARCO Admin Account Creation\n');
console.log('📧 Email:', ADMIN_EMAIL);
console.log('🔑 Password:', ADMIN_PASSWORD);
console.log('');

async function createAdminAccount() {
  try {
    // Step 1: 회원가입 시도
    console.log('Step 1: Creating auth account...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          full_name: ADMIN_NAME,
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('⚠️  Account already exists. Attempting to sign in...\n');
        
        // 이미 존재하면 로그인 시도
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });

        if (signInError) {
          console.log('❌ Sign in failed:', signInError.message);
          console.log('\n💡 Solution: Reset password in Supabase Dashboard:');
          console.log('   Authentication → Users → Find user → Reset Password');
          return;
        }

        console.log('✅ Signed in successfully!');
        console.log('   User ID:', signInData.user.id);
        
        // Admin 권한 부여
        await grantAdminRole(signInData.user.id);
        return;
      } else {
        throw signUpError;
      }
    }

    console.log('✅ Auth account created!');
    console.log('   User ID:', signUpData.user.id);

    // Step 2: Admin 권한 부여
    await grantAdminRole(signUpData.user.id);

    console.log('\n🎉 Admin account created successfully!\n');
    console.log('📋 Login Details:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   Login URL: http://localhost:3000/admin/login\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Please create the account manually:');
    console.log('   1. Go to Supabase Dashboard → Authentication → Users');
    console.log('   2. Add user:', ADMIN_EMAIL);
    console.log('   3. Run SQL: SELECT promote_to_admin(\'' + ADMIN_EMAIL + '\');');
  }
}

async function grantAdminRole(userId) {
  console.log('\nStep 2: Granting admin role...');

  // users 테이블 업데이트
  const { error: usersError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (usersError) {
    console.log('⚠️  Warning (users table):', usersError.message);
  } else {
    console.log('✅ Updated users table');
  }

  // profiles 테이블 업데이트
  const { error: profilesError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (profilesError) {
    console.log('⚠️  Warning (profiles table):', profilesError.message);
  } else {
    console.log('✅ Updated profiles table');
  }

  // 확인
  const { data: userData } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', userId)
    .single();

  if (userData) {
    console.log('✅ Admin role granted!');
    console.log('   Email:', userData.email);
    console.log('   Role:', userData.role);
  }
}

// 실행
createAdminAccount();
