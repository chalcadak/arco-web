#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uuiresymwsjpamntmkyb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjYwMzgsImV4cCI6MjA4MzY0MjAzOH0.VrxrjbBvMg8PvpvswvWxlAQj75YVBlvFdkd1ULz19TU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_EMAIL = 'admin@arco.com';

console.log('🔍 ARCO Admin Account Verification\n');
console.log('📧 Checking email:', ADMIN_EMAIL);
console.log('');

async function verifyAdminAccount() {
  try {
    // 1. auth.users 확인
    console.log('Step 1: Checking auth.users table...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('⚠️  Cannot check auth.users (need service role key)');
    } else {
      const authUser = authData.users.find(u => u.email === ADMIN_EMAIL);
      if (authUser) {
        console.log('✅ Auth account exists!');
        console.log('   User ID:', authUser.id);
        console.log('   Email confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No');
      } else {
        console.log('❌ Auth account not found');
      }
    }

    // 2. users 테이블 확인 (RLS 때문에 실패할 수 있음)
    console.log('\nStep 2: Checking users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (usersError) {
      console.log('⚠️  Cannot read users table:', usersError.message);
      console.log('   (This is normal if RLS is enabled and you\'re not logged in)');
    } else if (usersData) {
      console.log('✅ User record exists!');
      console.log('   User ID:', usersData.id);
      console.log('   Email:', usersData.email);
      console.log('   Name:', usersData.name || 'N/A');
      console.log('   Role:', usersData.role);
      console.log('   Created:', new Date(usersData.created_at).toLocaleString());
      
      if (usersData.role === 'admin') {
        console.log('   🎉 Admin role confirmed!');
      } else {
        console.log('   ⚠️  Role is NOT admin (current:', usersData.role + ')');
      }
    } else {
      console.log('❌ User record not found');
    }

    // 3. profiles 테이블 확인
    console.log('\nStep 3: Checking profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (profilesError) {
      console.log('⚠️  Cannot read profiles table:', profilesError.message);
    } else if (profilesData) {
      console.log('✅ Profile exists!');
      console.log('   User ID:', profilesData.id);
      console.log('   Email:', profilesData.email);
      console.log('   Full name:', profilesData.full_name || 'N/A');
      console.log('   Role:', profilesData.role);
      
      if (profilesData.role === 'admin') {
        console.log('   🎉 Admin role confirmed!');
      } else {
        console.log('   ⚠️  Role is NOT admin (current:', profilesData.role + ')');
      }
    } else {
      console.log('❌ Profile not found');
    }

    // 4. 로그인 테스트
    console.log('\n\nStep 4: Testing login...');
    console.log('⚠️  Note: This requires the correct password');
    console.log('If you want to test login, uncomment the code below\n');

    console.log('\n📋 Summary:');
    console.log('─────────────────────────────────────');
    console.log('To verify admin account manually, run this SQL in Supabase:');
    console.log('');
    console.log('SELECT id, email, role FROM users WHERE email = \'' + ADMIN_EMAIL + '\';');
    console.log('SELECT id, email, role FROM profiles WHERE email = \'' + ADMIN_EMAIL + '\';');
    console.log('');
    console.log('Expected result: role = \'admin\' in both tables');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyAdminAccount();
