# 🚀 ARCO 다음 단계 - 초간단 가이드

## 🔥 **지금 바로 (30분)**

### 1️⃣ 로컬 테스트
```bash
cd /home/user/webapp
npm run dev
```

**확인할 것**:
- ✅ http://localhost:3000/admin/login (로그인 되나?)
- ✅ http://localhost:3000/admin/dashboard (AI 추천 보이나?)
- ✅ http://localhost:3000 (메인 페이지 정상?)

**예상 결과**:
- AI 추천: "추천이 없습니다" ← **정상** (데이터 부족)
- 차트: 0으로 표시 ← **정상** (주문 없음)

---

## 📊 **오늘 중 (2시간)**

### 2️⃣ 테스트 데이터 추가

**Supabase Dashboard → SQL Editor**에서 실행:

```sql
-- 테스트 상품 10개
INSERT INTO products (name, slug, description, price, category, stock, is_active, images)
VALUES 
  ('프리미엄 울 코트', 'premium-wool-coat', '고급 울 소재', 120000, 'outer', 10, true, ARRAY['https://via.placeholder.com/500']),
  ('캐시미어 목도리', 'cashmere-scarf', '부드러운 소재', 80000, 'accessory', 15, true, ARRAY['https://via.placeholder.com/500']),
  ('레더 하네스', 'leather-harness', '프리미엄 가죽', 50000, 'accessory', 20, true, ARRAY['https://via.placeholder.com/500']),
  ('겨울 패딩', 'winter-padding', '따뜻한 패딩', 150000, 'outer', 8, true, ARRAY['https://via.placeholder.com/500']),
  ('니트 스웨터', 'knit-sweater', '귀여운 니트', 60000, 'innerwear', 25, true, ARRAY['https://via.placeholder.com/500']),
  ('방한 부츠', 'winter-boots', '미끄럼 방지', 70000, 'shoes', 12, true, ARRAY['https://via.placeholder.com/500']),
  ('레인코트', 'raincoat', '방수 레인코트', 45000, 'outer', 30, true, ARRAY['https://via.placeholder.com/500']),
  ('체크 셔츠', 'check-shirt', '캐주얼 체크', 40000, 'innerwear', 18, true, ARRAY['https://via.placeholder.com/500']),
  ('벨벳 리본', 'velvet-ribbon', '고급 리본', 25000, 'accessory', 50, true, ARRAY['https://via.placeholder.com/500']),
  ('털 조끼', 'fur-vest', '포근한 조끼', 90000, 'outer', 5, true, ARRAY['https://via.placeholder.com/500']);
```

**확인**: http://localhost:3000/products (상품 10개 보임)

---

## 🚀 **내일 (1시간)**

### 3️⃣ Vercel 배포

**3단계**:

1. **https://vercel.com/dashboard** 접속
2. **New Project** → Import `chalcadak/arco-web`
3. **환경 변수 추가**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://uuiresymwsjpamntmkyb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   NEXT_PUBLIC_TOSS_CLIENT_KEY=test_gck_...
   TOSS_SECRET_KEY=test_gsk_...
   CLOUDFLARE_ACCOUNT_ID=5d66250b...
   CLOUDFLARE_R2_ACCESS_KEY_ID=...
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
   CLOUDFLARE_R2_BUCKET_NAME=arco-r2
   CLOUDFLARE_R2_PUBLIC_URL=https://pub-...
   ```
4. **Deploy** 클릭!

**결과**: https://arco-web.vercel.app (5분 후 오픈)

---

## 📋 **간단 체크리스트**

### 지금 (30분)
- [ ] `npm run dev` 실행
- [ ] 로그인 테스트
- [ ] 버그 있으면 알려주기

### 오늘 (2시간)
- [ ] 테스트 상품 10개 추가
- [ ] 상품 목록 확인

### 내일 (1시간)
- [ ] Vercel 배포
- [ ] 배포된 사이트 확인

---

## 🎊 **1주 후 목표**

✅ **서비스 오픈 가능!**
- 상품 10-20개
- 결제 가능
- 실제 사용 가능

---

## 💬 **대표님, 어떻게 하실래요?**

### 옵션 A: 테스트 먼저 (추천)
```
1. 로컬 테스트 (30분)
2. 문제 없으면 → 데이터 추가
3. 배포
```

### 옵션 B: 바로 배포
```
1. Vercel 배포 (30분)
2. 배포된 사이트에서 테스트
```

### 옵션 C: 데이터 먼저
```
1. 테스트 데이터 추가 (1시간)
2. 로컬 테스트
3. 배포
```

**제 추천: 옵션 A** (안전하고 확실함)

**어떤 옵션으로 진행할까요?** 🚀
