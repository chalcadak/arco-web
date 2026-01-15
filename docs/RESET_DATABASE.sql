-- ============================================================================
-- Supabase 완전 초기화 SQL
-- ============================================================================
-- 이 스크립트는 모든 테이블, 데이터, 마이그레이션 히스토리를 삭제합니다
-- ⚠️ 주의: 모든 데이터가 삭제됩니다! 테스트 DB에서만 사용하세요!
-- ============================================================================

-- Step 1: public schema 완전 삭제
DROP SCHEMA IF EXISTS public CASCADE;

-- Step 2: public schema 재생성
CREATE SCHEMA public;

-- Step 3: 권한 부여
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Step 4: Schema 설명 추가
COMMENT ON SCHEMA public IS 'standard public schema';

-- Step 5: supabase_migrations schema 확인 및 초기화
DO $$
BEGIN
    -- supabase_migrations.schema_migrations 테이블이 존재하면 모든 레코드 삭제
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'supabase_migrations' 
        AND table_name = 'schema_migrations'
    ) THEN
        DELETE FROM supabase_migrations.schema_migrations;
        RAISE NOTICE 'Migration history cleared';
    END IF;
END $$;

-- ============================================================================
-- 완료!
-- ============================================================================
-- 이제 npx supabase db push를 실행하세요
-- ============================================================================

-- 검증 쿼리 (선택사항)
-- SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT COUNT(*) as migration_count FROM supabase_migrations.schema_migrations;
