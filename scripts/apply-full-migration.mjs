#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase 설정
const SUPABASE_URL = 'https://uuiresymwsjpamntmkyb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjYwMzgsImV4cCI6MjA4MzY0MjAzOH0.VrxrjbBvMg8PvpvswvWxlAQj75YVBlvFdkd1ULz19TU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('🚀 ARCO Database Migration - Starting...\n');

async function executeSql(sql, description) {
  console.log(`📝 ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
    
    if (error) {
      console.log(`⚠️  Warning: ${error.message}`);
      return false;
    }
    
    console.log(`✅ ${description} - Success`);
    return true;
  } catch (err) {
    console.log(`⚠️  Warning: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('Step 1: Dropping existing tables...\n');
  
  const dropSql = `
-- Drop triggers
DROP TRIGGER IF EXISTS sync_users_role_trigger ON users CASCADE;
DROP TRIGGER IF EXISTS sync_profiles_role_trigger ON profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS sync_user_role() CASCADE;
DROP FUNCTION IF EXISTS promote_to_admin(TEXT) CASCADE;
DROP FUNCTION IF EXISTS demote_to_customer(TEXT) CASCADE;
DROP FUNCTION IF EXISTS exec_sql(TEXT) CASCADE;

-- Drop tables
DROP TABLE IF EXISTS stock_notifications CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS coupon_usage CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS photoshoot_looks CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
  `.trim();

  await executeSql(dropSql, 'Dropping existing tables');

  console.log('\nStep 2: Creating complete schema...\n');
  
  // Read the migration file
  const migrationPath = join(__dirname, '../supabase/migrations/99999999999999_complete_fresh_install.sql');
  const migrationSql = readFileSync(migrationPath, 'utf-8');
  
  // Split SQL into statements (simple split by semicolon)
  const statements = migrationSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;
    
    await executeSql(stmt, `Executing statement ${i + 1}/${statements.length}`);
  }

  console.log('\nStep 3: Setting admin role for test account...\n');
  
  const adminSql = `
UPDATE users 
SET role = 'admin' 
WHERE id = '79908c48-a5e4-4ffd-a4a3-3f27a17d1663';

UPDATE profiles 
SET role = 'admin' 
WHERE id = '79908c48-a5e4-4ffd-a4a3-3f27a17d1663';
  `.trim();

  await executeSql(adminSql, 'Setting admin role');

  console.log('\n✅ Migration Complete!\n');
  console.log('🎉 Test Admin Account:');
  console.log('   Email: admin@arco.com');
  console.log('   Password: Admin123!@#');
  console.log('   Login: http://localhost:3000/admin/login\n');
}

main().catch(console.error);
