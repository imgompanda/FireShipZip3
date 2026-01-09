# 02. Environment: 환경변수 설정

모든 환경변수에 대한 상세 설명이에요.

---

## 📁 파일 위치

프로젝트 루트의 `.env.local` 파일에 설정해요.

```bash
cp .env.local.example .env.local
```

---

## 🔐 Supabase (필수)

| 변수                            | 설명                  | 어디서 찾나요?                    |
| ------------------------------- | --------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase 프로젝트 URL | Settings → General → Project ID   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개 API 키           | Settings → API Keys → anon public |

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

📖 자세한 설정: [03-supabase](../03-supabase/)

---

## 💳 LemonSqueezy

| 변수                          | 설명             | 어디서 찾나요?        |
| ----------------------------- | ---------------- | --------------------- |
| `LEMONSQUEEZY_API_KEY`        | API 키 (lmsq\_)  | Settings → API        |
| `LEMONSQUEEZY_STORE_ID`       | 스토어 ID (숫자) | Settings → Stores     |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | 웹훅 시크릿      | Webhooks 생성 시 입력 |

```bash
LEMONSQUEEZY_API_KEY=lmsq_xxx
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxx
```

### 플랜 Variant ID

| 변수                         | 설명                  |
| ---------------------------- | --------------------- |
| `LEMONSQUEEZY_VARIANT_BASIC` | Basic 플랜 Variant ID |
| `LEMONSQUEEZY_VARIANT_PRO`   | Pro 플랜 Variant ID   |

```bash
LEMONSQUEEZY_VARIANT_BASIC=123456
LEMONSQUEEZY_VARIANT_PRO=123457
```

📖 자세한 설정: [04-lemon](../04-lemon/)

---

## 📧 Resend

| 변수                | 설명          | 어디서 찾나요?  |
| ------------------- | ------------- | --------------- |
| `RESEND_API_KEY`    | API 키 (re\_) | API Keys 페이지 |
| `RESEND_FROM_EMAIL` | 발신 이메일   | 인증된 도메인   |

```bash
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

📖 자세한 설정: [05-resend](../05-resend/)

---

## 🌐 앱 설정

| 변수                  | 설명          | 예시                  |
| --------------------- | ------------- | --------------------- |
| `NEXT_PUBLIC_APP_URL` | 배포된 앱 URL | `https://yourapp.com` |

```bash
# 로컬에서는 설정 안 해도 됨 (기본값: http://localhost:3000)
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

---

## 📋 전체 예시

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=lmsq_xxx
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxx
LEMONSQUEEZY_VARIANT_BASIC=123456
LEMONSQUEEZY_VARIANT_PRO=123457

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=hello@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

---

## ⚠️ 주의사항

- **절대** `.env.local`을 Git에 커밋하지 마세요!
- `.gitignore`에 이미 추가되어 있어요.
- 프로덕션에서는 Vercel 환경변수로 설정하세요.

---

**다음**: [03-supabase](../03-supabase/) - Supabase 연동하기
