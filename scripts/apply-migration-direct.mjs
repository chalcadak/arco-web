#!/usr/bin/env node

import fetch from 'node-fetch';
import * as fs from 'fs';

const SUPABASE_URL = 'https://uuiresymwsjpamntmkyb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA2NjAzOCwiZXhwIjoyMDgzNjQyMDM4fQ.VDprvHpAkjAyjZk8uWcD6ofdp0e8-_edYdSec4b_zK0';

console.log('🔧 마이그레이션 직접 적용 시도...\n');

const migrationSQL = fs.readFileSync('supabase/migrations/20260114000008_add_user_roles.sql', 'utf8');

// Split SQL into individual statements
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📦 총 ${statements.length}개의 SQL 명령 실행 중...\n`);

async function executeSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    return { ok: response.ok, status: response.status };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function applyMigration() {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < Math.min(statements.length, 5); i++) {
    const stmt = statements[i];
    console.log(`${i + 1}/${statements.length}: ${stmt.substring(0, 60)}...`);
    
    const result = await executeSQL(stmt);
    
    if (result.ok) {
      console.log('   ✅ 성공');
      successCount++;
    } else {
      console.log(`   ⚠️  실패 (${result.status || result.error})`);
      failCount++;
    }
  }

  console.log(`\n📊 결과: 성공 ${successCount}, 실패 ${failCount}\n`);
  
  if (failCount > 0) {
    console.log('⚠️  일부 명령이 실패했습니다.');
    console.log('   Supabase Dashboard에서 수동 적용을 권장합니다.\n');
  }
}

applyMigration();
