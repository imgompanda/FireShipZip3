# 07. AI Customization: AI로 커스터마이징하기

**Claude**, **Cursor**, **Windsurf** 같은 AI 코딩 툴로 보일러플레이트를 빠르게 커스터마이징할 수 있어요.

---

## 🎨 브랜딩 변경하기

AI에게 이렇게 요청하세요:

### 서비스 이름 변경

```
프로젝트 전체에서 "Global SaaS"를 "MyAwesomeApp"으로 변경해줘.
messages/en.json, messages/ko.json, 그리고 이메일 템플릿도 포함해서.
```

### 색상 변경

```
tailwind.config.ts에서 primary 색상을 #3B82F6 (파란색)으로 변경하고,
shadcn/ui 컴포넌트들도 이 색상을 사용하도록 해줘.
```

### 로고 변경

```
public/logo.svg 파일을 참조해서
- Header 컴포넌트에 로고 추가
- 파비콘도 업데이트
```

---

## 💳 LemonSqueezy 플랜 수정하기

### 가격 변경

```
messages/en.json과 ko.json에서
- Basic 플랜을 $19/월로 변경
- Pro 플랜을 $49/월로 변경
랜딩 페이지 Pricing 섹션도 업데이트해줘.
```

### 새 플랜 추가

```
Enterprise 플랜을 추가해줘:
- 가격: $99/월
- 기능: 모든 Pro 기능 + API 무제한 + 전담 지원
messages/에 번역 추가하고 Pricing 컴포넌트도 수정해줘.
```

---

## 📧 이메일 템플릿 수정하기

### 디자인 변경

```
src/components/emails/WelcomeEmail.tsx를 수정해서:
- 상단에 로고 이미지 추가 (URL: https://myapp.com/logo.png)
- 버튼 색상을 #10B981 (초록색)으로 변경
- 하단에 소셜 미디어 아이콘 추가
```

### 새 템플릿 추가

```
src/components/emails/에 TrialEndingEmail.tsx를 만들어줘.
- 트라이얼 3일 전에 보내는 이메일
- "지금 업그레이드하세요" CTA 버튼 포함
- 한/영 다국어 지원
- WelcomeEmail.tsx 스타일 따라가기
```

---

## 🗂️ DB 스키마 확장하기

### 새 컬럼 추가

```
docs/03-supabase/schema.sql을 수정해서
subscriptions 테이블에 다음 컬럼 추가해줘:
- trial_ends_at (TIMESTAMPTZ)
- last_payment_at (TIMESTAMPTZ)
src/types/subscription.ts도 업데이트해줘.
```

### 새 테이블 추가

```
docs/03-supabase/schema.sql에 user_preferences 테이블 추가해줘:
- id (UUID)
- user_id (FK to users)
- theme (TEXT: 'light' | 'dark')
- notifications_enabled (BOOLEAN)
- created_at, updated_at
RLS 정책도 포함해서.
```

---

## 🌍 다국어 추가하기

### 새 언어 추가

```
일본어(ja) 지원을 추가해줘:
1. messages/ja.json 생성 (en.json 기반으로 번역)
2. src/i18n/routing.ts에 'ja' 추가
3. 랜딩 페이지에 언어 선택 드롭다운 추가
```

---

## 📄 새 페이지 추가하기

### About 페이지

```
src/app/[locale]/about/page.tsx를 만들어줘:
- 회사 소개 섹션
- 팀 멤버 섹션 (사진 + 이름 + 역할)
- 연락처 정보
- i18n 지원
- 기존 레이아웃 스타일 따라가기
```

---

## 💡 프롬프트 작성 팁

1. **구체적으로**: "색상 변경" 보다 "primary 색상을 #3B82F6으로"
2. **파일 경로 명시**: "이메일 템플릿" 보다 "src/components/emails/"
3. **기존 패턴 참조**: "WelcomeEmail.tsx 스타일 따라가기"
4. **i18n 언급**: 번역 파일 업데이트도 함께 요청

---

**이제 AI와 함께 여러분만의 SaaS를 만들어보세요! 🚀**
