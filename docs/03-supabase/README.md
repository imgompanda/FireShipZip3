# 03. Supabase 설정

Supabase를 연동하여 **인증**과 **데이터베이스**를 사용할 수 있어요.

---

## 1단계: Supabase 프로젝트 생성

1. [Supabase 대시보드](https://supabase.com/dashboard)에 접속하세요.
2. **"New Project"** 버튼을 클릭하세요.
3. 다음 정보를 입력하세요:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 강력한 비밀번호 (꼭 기록해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 추천
4. **"Create new project"** 클릭 후 1~2분 기다리세요.

---

## 2단계: API 키 복사하기

프로젝트가 생성되면:

### Project URL 복사

1. 좌측 메뉴에서 **⚙️ Project Settings** → **General** 클릭
2. **Project ID** 복사 (예: `yefkaazcfppacgwuaqp`)
   ![alt text](<스크린샷 2026-01-02 오전 9.14.47.png>)
3. URL 형식: `https://{Project ID}.supabase.co`

### API Key 복사

1. **⚙️ Project Settings** → **API Keys** 클릭
2. **"Legacy anon, service_role API keys"** 탭 선택
   ![alt text](<스크린샷 2026-01-02 오전 9.20.55.png>)
3. **anon public** 키 복사
4. **service_role secret** 키도 복사 (웹훅용 - RLS 우회)

> ⚠️ **주의**: `service_role` 키는 절대 클라이언트에 노출되면 안 됩니다!

### .env.local에 입력

```bash
NEXT_PUBLIC_SUPABASE_URL=https://여기에-ProjectID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한-anon-키
SUPABASE_SERVICE_ROLE_KEY=복사한-service_role-키
```

---

## 3단계: 데이터베이스 테이블 생성

1. Supabase Dashboard → **🗂️ SQL Editor** 클릭
2. **"New query"** 클릭
3. 이 폴더에 있는 `schema.sql` 파일 내용을 복사해서 붙여넣기
4. **"Run"** 클릭

✅ 성공하면 3개 테이블이 생성돼요:

- `users` - 사용자 프로필
- `subscriptions` - 구독 정보
- `lemon_webhook_events` - LemonSqueezy 이벤트 로그

---

## 4단계: Google OAuth 설정

1. Supabase Dashboard → **🔐 Authentication** → **Providers**
2. **Google** 클릭 → **Enable** 토글 켜기
3. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성 후 OAuth 클라이언트 생성:
   - **OAuth 동의 화면** 설정 (External 선택)
   - **사용자 인증 정보** -> **OAuth 2.0 클라이언트 ID** 생성
   - **승인된 리디렉션 URI**: Supabase Dashboard의 Callback URL 복사/붙여넣기
4. 생성된 Client ID와 Client Secret을 Supabase에 붙여넣기
5. **Save** 클릭

---

## 5단계: 이메일 매직 링크 (Magic Link) 설정

이메일 주소만으로 로그인하는 매직 링크 기능을 위해 **URL 설정**이 필요해요.

1. Supabase Dashboard → **🔐 Authentication** → **URL Configuration**
2. **Site URL** 설정:
   - 로컬 개발 시: `http://localhost:3000`
   - 배포 후: `https://your-project.vercel.app` (또는 커스텀 도메인)
3. **Redirect URLs**에 다음 경로들을 추가하세요:
   - `http://localhost:3000/**`
   - `https://your-project.vercel.app/**` (배포 후)
   - `https://your-custom-domain.com/**` (커스텀 도메인 사용 시)

> **팁**: Email Customization에서 이메일 제목과 내용을 수정할 수 있어요.
> (Authentication → Notifications → Email → Magic Link)

---

## 💡 AI로 스키마 확장/변경하기

**Claude Code**, **Cursor**, **Windsurf** 같은 AI 코딩 툴을 사용하면 스키마를 쉽게 확장할 수 있어요.

### 예시: 새 컬럼 추가하기

AI에게 이렇게 요청해보세요:

```
`docs/supabase-schema.sql` 파일을 수정해서
`subscriptions` 테이블에 `trial_ends_at` (TIMESTAMPTZ) 컬럼을 추가해줘.
RLS 정책은 그대로 유지하고, 기존 테이블과 호환되도록 해줘.
```

### 예시: 새 테이블 추가하기

```
`docs/supabase-schema.sql`에 `user_activity_logs` 테이블을 추가해줘.
컬럼은 id, user_id, action, metadata(jsonb), created_at이야.
RLS 정책도 포함해서 자기 활동만 볼 수 있게 해줘.
```

💡 **팁**: 스키마 변경 후에는 `src/types/` 폴더의 TypeScript 타입도 함께 업데이트하세요.

---

## 🧪 테스트하기

1. `npm run dev` 실행
2. `http://localhost:3000/ko/login` 접속
3. **Google로 계속하기** 클릭
4. Dashboard로 이동하면 성공! 🎉

---

## 💬 문제 해결

### "Invalid login credentials" 에러

→ `.env.local` 키가 정확한지 확인하세요.

### Google 로그인 시 "redirect_uri_mismatch" 에러

→ Google Cloud Console의 **승인된 리디렉션 URI**가 정확한지 확인하세요.

---

**다음**: [04-lemon](../04-lemon/) - LemonSqueezy 결제 설정
