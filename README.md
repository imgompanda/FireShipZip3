# Global SaaS Starter Kit

<div align="center">

# 🚀 SaaS Starter Kit

**한국 개발자를 위한 최고의 Next.js SaaS 보일러플레이트**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![LemonSqueezy](https://img.shields.io/badge/LemonSqueezy-Payments-FFC700?style=flat-square&logo=lemon&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

<br/>

### 👋 잠깐! 이 프로젝트는 **AI와 함께할 때** 가장 강력합니다.

**복잡한 문서를 읽지 마세요. AI가 대신 읽고 설치해드립니다.**

[✨ AI로 1분 만에 세팅하기](#-ai-collaborator-setup) • [기능 소개](#-주요-기능-key-features) • [사람을 위한 가이드](#-setup-for-humans)

</div>

---

## 🤖 AI Collaborator Setup

**(추천: Cursor, Windsurf, Claude 사용자)**

이 프로젝트에는 **AI 전용 온보딩 매니저 프롬프트**가 내장되어 있습니다.
개발자는 커피 한 잔 하세요. 설정은 AI가 합니다.

### 1단계: 프로젝트 열기

[Cursor](https://cursor.sh/) 또는 [Windsurf](https://codeium.com/windsurf) 같은 AI 에디터로 이 프로젝트 폴더를 엽니다.

### 2단계: AI에게 명령하기 (복사/붙여넣기)

에디터의 Chat(⌘+L / ⌘+K) 창에 아래 명령어를 그대로 붙여넣으세요:

```markdown
@docs/llm.md 파일을 읽고, "AI Onboarding Manager"로서
이 프로젝트의 설정을 시작해줘. (한국어로 가이드해줘)
```

### 3단계: AI의 안내 따르기

AI가 `setup_progress.md` 파일을 만들고, 필요한 설정(계정 생성, 환경변수 입력 등)을 단계별로 안내할 것입니다. 질문에 답만 해주세요!

---

## 🎯 이게 뭔가요?

**Global SaaS Starter Kit**은 SaaS를 몇 시간 만에 구축할 수 있는 Next.js 16 템플릿입니다. 인증, 결제, 이메일 같은 필수 기능이 이미 구현되어 있어 **핵심 비즈니스 로직**에만 집중할 수 있습니다.

## ✨ 주요 기능 (Key Features)

| 기능          | 설명                                |
| ------------- | ----------------------------------- |
| 🔐 **인증**   | Google OAuth, Magic Link (Supabase) |
| 💳 **결제**   | 구독 결제, 고객 포털 (LemonSqueezy) |
| 📧 **이메일** | Welcome, 결제 실패 알림 (Resend)    |
| 🌍 **다국어** | 한국어/영어 지원 (next-intl)        |
| 🎨 **UI**     | Tailwind CSS + shadcn/ui            |
| 📊 **어드민** | 판매 내역, 고객 관리 Dashboard      |

---

## 🛠️ Setup (for Humans)

직접 문서를 보고 설정하고 싶다면 아래 가이드를 순서대로 따르세요.

### 🏗️ 필수 설정 (Essential)

1. **[docs/00-overview](docs/00-overview)**: 계정 준비
2. **[docs/01-quick-start](docs/01-quick-start)**: 로컬 실행
3. **[docs/03-supabase](docs/03-supabase)**: 인증 설정
4. **[docs/04-lemon](docs/04-lemon)**: 결제 설정
5. **[docs/05-resend](docs/05-resend)**: 이메일 발송 설정
6. **[docs/06-deployment](docs/06-deployment)**: 배포하기

### 🎨 심화 & 커스터마이징 (Advanced)

6. **[docs/07-ai-customization](docs/07-ai-customization)**: AI 프롬프트 수정
7. **[docs/08-admin-console](docs/08-admin-console)**: 어드민 기능 활용
8. **[docs/09-seo](docs/09-seo)**: 검색 엔진 최적화 (SEO)
9. **[docs/10-ui](docs/10-ui)**: UI 컴포넌트 & 테마
10. **[docs/11-support](docs/11-support)**: 고객 지원 시스템

---

## ⚠️ 라이선스 및 법적 고지

> [!CAUTION]
> **이 프로젝트는 유료 라이선스 상품입니다.**

- **허용**: 정품 구매자의 상업적 프로젝트 이용
- **금지**: 재배포, 재판매, GitHub Public 업로드

**문의**: kr2idiots@gmail.com

---

**© 2026 FreAiner.**
