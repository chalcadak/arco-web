#!/bin/bash
# =============================================================================
# Supabase 마이그레이션 테스트 스크립트
# =============================================================================
# 사용법:
#   ./scripts/test-migration.sh [옵션]
#
# 옵션:
#   --local       로컬 Supabase 인스턴스 테스트 (Docker 필요)
#   --remote      원격 Supabase DB 테스트 (Dashboard 사용)
#   --verify      마이그레이션 검증만 실행
# =============================================================================

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수: 에러 메시지
error() {
    echo -e "${RED}❌ 오류: $1${NC}" >&2
    exit 1
}

# 함수: 성공 메시지
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 함수: 정보 메시지
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 함수: 경고 메시지
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 함수: Supabase CLI 설치 확인
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        warning "Supabase CLI가 설치되지 않았습니다."
        echo ""
        echo "설치 방법:"
        echo "  macOS:   brew install supabase/tap/supabase"
        echo "  NPM:     npm install -g supabase"
        echo ""
        read -p "지금 NPM으로 설치하시겠습니까? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g supabase
            success "Supabase CLI 설치 완료!"
        else
            error "Supabase CLI가 필요합니다."
        fi
    fi
    success "Supabase CLI 확인 완료 ($(supabase --version))"
}

# 함수: Docker 설치 확인
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker가 설치되지 않았습니다. https://www.docker.com/products/docker-desktop"
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker가 실행되지 않았습니다. Docker Desktop을 시작해주세요."
    fi
    
    success "Docker 확인 완료"
}

# 함수: 마이그레이션 파일 검증
verify_migrations() {
    info "마이그레이션 파일 검증 중..."
    
    migration_dir="supabase/migrations"
    
    if [ ! -d "$migration_dir" ]; then
        error "마이그레이션 디렉토리를 찾을 수 없습니다: $migration_dir"
    fi
    
    migration_count=$(ls -1 "$migration_dir"/*.sql 2>/dev/null | wc -l)
    
    if [ "$migration_count" -eq 0 ]; then
        error "마이그레이션 파일이 없습니다."
    fi
    
    success "$migration_count개의 마이그레이션 파일 발견"
    
    echo ""
    echo "마이그레이션 파일 목록:"
    ls -1 "$migration_dir"/*.sql | while read file; do
        echo "  - $(basename "$file")"
    done
    echo ""
}

# 함수: 로컬 Supabase 테스트
test_local() {
    info "로컬 Supabase 인스턴스로 테스트를 시작합니다..."
    
    check_docker
    
    # Supabase 시작
    info "Supabase 컨테이너 시작 중... (첫 실행은 5-10분 소요)"
    supabase start
    
    # 마이그레이션 적용
    info "마이그레이션 적용 중..."
    supabase db reset
    
    success "로컬 마이그레이션 테스트 완료!"
    
    echo ""
    echo "로컬 Supabase 접속 정보:"
    echo "  Studio URL: http://localhost:54323"
    echo "  API URL: http://localhost:54321"
    echo ""
    echo "다음 명령어로 확인:"
    echo "  open http://localhost:54323"
    echo ""
    echo "중지: supabase stop"
}

# 함수: 원격 Supabase 안내
test_remote() {
    info "원격 Supabase DB 테스트 안내"
    
    echo ""
    echo "📋 원격 DB 테스트 단계:"
    echo ""
    echo "1️⃣  Supabase Dashboard 접속"
    echo "   https://supabase.com/dashboard"
    echo ""
    echo "2️⃣  프로젝트 선택"
    echo "   uuiresymwsjpamntmkyb (현재 DB)"
    echo ""
    echo "3️⃣  SQL Editor 열기"
    echo "   왼쪽 메뉴 → SQL Editor"
    echo ""
    echo "4️⃣  마이그레이션 파일 실행"
    echo "   supabase/migrations/99999999999999_complete_fresh_install.sql"
    echo ""
    echo "5️⃣  결과 확인"
    echo "   Table Editor → 테이블 생성 확인"
    echo ""
    
    warning "주의: 운영 DB에 직접 적용하기 전에 테스트 DB에서 먼저 테스트하세요!"
}

# 함수: 도움말
show_help() {
    echo "Supabase 마이그레이션 테스트 스크립트"
    echo ""
    echo "사용법:"
    echo "  ./scripts/test-migration.sh [옵션]"
    echo ""
    echo "옵션:"
    echo "  --local       로컬 Supabase 인스턴스 테스트 (Docker 필요)"
    echo "  --remote      원격 Supabase DB 테스트 안내"
    echo "  --verify      마이그레이션 파일 검증만 실행"
    echo "  --help        이 도움말 표시"
    echo ""
    echo "예제:"
    echo "  ./scripts/test-migration.sh --local"
    echo "  ./scripts/test-migration.sh --verify"
    echo ""
}

# =============================================================================
# 메인 실행
# =============================================================================

# 옵션 파싱
case "${1:-}" in
    --local)
        echo ""
        info "로컬 Supabase 마이그레이션 테스트"
        echo ""
        check_supabase_cli
        verify_migrations
        test_local
        ;;
    --remote)
        echo ""
        info "원격 Supabase 마이그레이션 테스트"
        echo ""
        verify_migrations
        test_remote
        ;;
    --verify)
        echo ""
        info "마이그레이션 파일 검증"
        echo ""
        verify_migrations
        success "검증 완료!"
        ;;
    --help)
        show_help
        ;;
    *)
        show_help
        echo ""
        warning "옵션을 선택해주세요."
        exit 1
        ;;
esac

echo ""
success "테스트 완료!"
echo ""
