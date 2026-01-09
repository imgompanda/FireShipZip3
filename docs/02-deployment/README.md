# 06. Deployment: Vercel 배포

Vercel에 배포하면 **HTTPS + CDN + 자동 배포**가 무료로 제공돼요.

---

## 1단계: Vercel 계정 연결

1. [Vercel](https://vercel.com)에 가입하세요.
2. GitHub 계정 연결

---

## 2단계: 프로젝트 Import

1. Vercel Dashboard → **Add New** → **Project**
2. GitHub 레포지토리 선택
3. **Import** 클릭

---

## 3단계: 환경변수 설정

### 🎯 가장 쉬운 방법: 복사 & 붙여넣기!

Vercel은 `.env` 파일 내용을 그대로 붙여넣으면 **자동으로 파싱**해줘요!

1. `.env.local` 파일 전체 내용 복사 (`Ctrl+A` → `Ctrl+C`)
2. Vercel → **Settings** → **Environment Variables**
3. 입력 필드에 **붙여넣기** (`Ctrl+V`)
4. 자동으로 모든 변수가 파싱되어 입력됨!
5. **Save** 클릭

> 💡 **팁**: 주석(`#`)은 자동으로 무시되니 그대로 붙여넣어도 OK!

---

### 방법 B: 수동으로 입력

Vercel Dashboard → **Environment Variables** 섹션에서 직접 추가:

| 변수                                     | 값                                          |
| ---------------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`               | Supabase URL                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`          | Supabase anon key                           |
| `SUPABASE_SERVICE_ROLE_KEY`              | Supabase service_role key (웹훅용)          |
| `LEMONSQUEEZY_API_KEY`                   | LemonSqueezy API 키                         |
| `LEMONSQUEEZY_STORE_ID`                  | LemonSqueezy 스토어 ID                      |
| `LEMONSQUEEZY_WEBHOOK_SECRET`            | LemonSqueezy 웹훅 시크릿                    |
| `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC` | Basic 플랜 Variant ID                       |
| `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO`   | Pro 플랜 Variant ID                         |
| `RESEND_API_KEY`                         | Resend API 키                               |
| `RESEND_FROM_EMAIL`                      | 발신자 이메일                               |
| `NEXT_PUBLIC_APP_URL`                    | 배포될 URL (예: `https://myapp.vercel.app`) |
| `ADMIN_EMAILS`                           | 어드민 접근 허용 이메일 (쉼표 구분)         |

⚠️ **중요**: 배포 후 `NEXT_PUBLIC_APP_URL`을 실제 Vercel URL로 업데이트하세요!

---

## 4단계: 배포

**Deploy** 버튼 클릭!

1~2분 후 URL이 생성돼요. (예: `https://your-app.vercel.app`)

---

## 💡 Tip: `vercel env pull`로 환경변수 동기화

Vercel에 환경 변수를 설정한 후, 로컬에서 동일한 변수를 사용하고 싶다면:

```bash
# Vercel CLI 설치 (없다면)
npm i -g vercel

# Vercel 프로젝트 연결
vercel link

# 환경 변수 다운로드 → .env.local 자동 생성!
vercel env pull .env.local
```

> 🔄 **양방향 동기화**:
>
> - **로컬 → Vercel**: Import .env 기능 사용
> - **Vercel → 로컬**: `vercel env pull` 명령어 사용

> 💡 **팁**: `vercel dev`를 사용하면 환경 변수를 자동으로 메모리에 로드해서 `vercel env pull`이 필요 없어요!

---

## 5단계: LemonSqueezy 프로덕션 Webhook 설정

1. [LemonSqueezy Dashboard](https://app.lemonsqueezy.com) → **Settings** → **Webhooks**
2. **New Webhook** 클릭
3. 다음 정보 입력:
   - **URL**: `https://your-app.vercel.app/api/webhooks/lemon`
   - **Secret**: Vercel 환경변수에 설정한 값과 동일하게 입력
   - **Events**:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_payment_success`
     - `subscription_payment_failed`
4. **Save** 클릭

---

## 6단계: Supabase OAuth 업데이트

Supabase Dashboard → **Authentication** → **URL Configuration**:

1. **Site URL**: `https://your-app.vercel.app`
2. **Redirect URLs**: `https://your-app.vercel.app/**`

Google Cloud Console에서도 **승인된 리디렉션 URI** 업데이트!

---

## ✅ 배포 완료 체크리스트

- [ ] 사이트 접속 확인
- [ ] Google 로그인 테스트
- [ ] LemonSqueezy 테스트 결제
- [ ] 이메일 발송 테스트

---

## 💡 커스텀 도메인 연결

1. Vercel Dashboard → **Settings** → **Domains**
2. 도메인 입력 (예: `yourapp.com`)
3. DNS 설정 안내에 따라 레코드 추가
4. 자동으로 SSL 인증서 발급!

---

## 💬 문제 해결

### 빌드 실패

→ 로컬에서 `pnpm build` 테스트 후 에러 확인

### 환경변수가 적용 안 됨

→ Vercel에서 환경변수 추가 후 **Redeploy** 필요

---

**다음**: [03-supabase](../03-supabase/) - Supabase 인증 설정
