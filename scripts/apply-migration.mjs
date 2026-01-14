#!/usr/bin/env node

/**
 * Apply migration to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://uuiresymwsjpamntmkyb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA2NjAzOCwiZXhwIjoyMDgzNjQyMDM4fQ.VDprvHpAkjAyjZk8uWcD6ofdp0e8-_edYdSec4b_zK0';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🔧 마이그레이션 적용 시작...\n');

// Read migration file
const migrationSQL = fs.readFileSync('supabase/migrations/20260114000008_add_user_roles.sql', 'utf8');

async function applyMigration() {
  try {
    console.log('📄 마이그레이션 파일 읽기 완료');
    console.log('📦 SQL 실행 중...\n');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL }).catch(async () => {
      // If rpc doesn't work, try direct query
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ query: migrationSQL }),
      });
      
      if (!response.ok) {
        throw new Error('Direct SQL execution failed');
      }
      
      return { data: await response.json(), error: null };
    });
    
    if (error) {
      console.error('❌ 마이그레이션 실패:', error.message);
      console.log('\n⚠️  Supabase Dashboard에서 수동으로 적용이 필요합니다.');
      console.log('   SQL Editor에서 다음 파일을 실행하세요:');
      console.log('   supabase/migrations/20260114000008_add_user_roles.sql\n');
      return false;
    }
    
    console.log('✅ 마이그레이션 적용 완료!\n');
    return true;
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
    console.log('\n⚠️  자동 적용 실패. Supabase Dashboard에서 수동 적용이 필요합니다.\n');
    console.log('📋 수동 적용 방법:');
    console.log('   1. https://supabase.com/dashboard 접속');
    console.log('   2. 프로젝트 선택');
    console.log('   3. SQL Editor 클릭');
    console.log('   4. 아래 파일 내용을 붙여넣고 Run:');
    console.log('      supabase/migrations/20260114000008_add_user_roles.sql\n');
    return false;
  }
}

applyMigration();
