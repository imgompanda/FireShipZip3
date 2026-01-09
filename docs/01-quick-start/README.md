# 01. Quick Start: 5분 만에 로컬 실행하기

이 가이드를 따라하면 **5분 안에** 로컬에서 프로젝트를 실행할 수 있어요.

---

## 사전 준비

다음이 설치되어 있어야 해요:

- **Node.js 18+** → [nodejs.org](https://nodejs.org)
- **pnpm** (권장) 또는 npm → `npm install -g pnpm`

---

## Step 1: 프로젝트 폴더 열기

다운로드 받은 폴더를 터미널에서 열어주세요:

```bash
cd global-saas-starter-kit
```

---

## Step 2: 의존성 설치

```bash
pnpm install
# 또는
npm install
```

---

## Step 3: 환경변수 파일 생성

```bash
cp .env.local.example .env.local
```

파일 생성 확인! `.env.local` 파일이 생겼으면 OK 👍

### ⚠️ 중요: ADMIN_EMAILS 설정

`.env.local` 파일을 열고 **ADMIN_EMAILS**를 본인 이메일로 변경하세요:

```bash
# 어드민 권한을 가질 사용자 이메일 (콤마로 구분)
ADMIN_EMAILS=your-google-email@gmail.com
```

> 💡 **팁**: Google OAuth 로그인에 사용할 이메일을 입력하세요!
>
> - 테스트용 Google 계정 또는 본인 Google 계정
> - 이 이메일로 로그인하면 **어드민 대시보드**에 접근할 수 있어요

> [!NOTE]
> 나머지 값들(Supabase, LemonSqueezy 등)은 다음 문서에서 **하나씩 채울 거예요**.

---

## Step 4: 개발 서버 실행

일단 서버를 켜볼게요. (아직 환경변수가 없어서 일부 기능은 안 될 수 있어요)

```bash
pnpm dev
# 또는
npm run dev
```

---

## Step 5: 브라우저에서 확인

[http://localhost:3000](http://localhost:3000) 접속!

🎉 **랜딩 페이지가 보이면 성공!**

> ⚠️ 로그인 같은 기능은 아직 안 돼요. 다음 단계에서 설정할 거예요.

---

## 다음 단계

이제 본격적으로 서비스들을 연동해볼게요.  
**순서대로 진행하세요!**

| 순서 | 가이드                             | 설명                  | 비고                           |
| ---- | ---------------------------------- | --------------------- | ------------------------------ |
| 1    | [02-deployment](../02-deployment/) | **Vercel 배포 먼저!** | URL 확정 후 설정하면 편해요    |
| 2    | [03-supabase](../03-supabase/)     | 인증 + DB 연동        | localhost + 배포 URL 동시 설정 |
| 3    | [04-lemon](../04-lemon/)           | 결제 시스템 연동      | 배포 URL로 Webhook 설정        |
| 4    | [05-resend](../05-resend/)         | 이메일 발송 설정      | API Key만 설정하면 OK          |

💡 **팁**: 03-supabase만 완료해도 로그인/회원가입이 작동해요!

---

## 💬 문제 해결

### ❌ 페이지가 하얀색으로 나오고 에러가 떠요 (Root Layout 에러)

Next.js 16 (Turbopack) 버전부터는 Root Layout(`src/app/layout.tsx`)에 `<html>`과 `<body>` 태그가 반드시 포함되어야 해요.
보일러플레이트 최신 버전에는 반영되어 있지만, 수동으로 수정할 경우 이 태그들이 누락되지 않았는지 확인하세요.

### ❌ `pnpm` 명령어를 찾을 수 없어요

`pnpm`이 설치되어 있지 않다면 `npm install`을 사용해도 무방해요. 하지만 일관된 패키지 관리를 위해 `corepack enable` 또는 `npm install -g pnpm`으로 설치하는 것을 권장해요.

### `Error: NEXT_PUBLIC_SUPABASE_URL is not defined`

→ `.env.local` 파일이 있는지 확인하세요.  
→ 아직 값을 안 채웠다면 [03-supabase](../03-supabase/)로 이동하세요!

### 포트 3000이 이미 사용 중

→ 다른 포트로 실행: `pnpm dev -p 3001`
