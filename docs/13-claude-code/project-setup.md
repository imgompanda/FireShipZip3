# FireShip 보일러플레이트 + Claude Code = 10분 런칭

> Git으로 다운로드하고, Claude Code에게 "설정해줘" 한마디면 끝이에요!

---

## 전체 흐름

```
Git 다운로드 → Claude Code로 환경변수 설정 → 한마디로 실행 → 완성! 🎉
```

---

## 1단계: Git으로 프로젝트 다운로드

### Git 설치 확인

터미널에서 아래 명령어를 입력해요:

```bash
git --version
```

버전이 나오면 이미 설치되어 있는 거예요. 안 나오면:

- **Mac**: `xcode-select --install`
- **Windows**: [git-scm.com](https://git-scm.com) 에서 다운로드

### 프로젝트 클론하기

```bash
git clone [보일러플레이트 URL] my-saas
cd my-saas
```

> 💡 **팁**: `my-saas` 부분을 원하는 프로젝트 이름으로 바꿔도 돼요.

---

## 2단계: Claude Code로 환경변수 설정

이 프로젝트는 여러 외부 서비스와 연동되는데, 환경변수를 설정해야 해요.
직접 할 필요 없어요! Claude Code에게 맡기세요.

### Claude Code 시작

```bash
claude
```

### 환경변수 설정 요청

```
"환경변수 설정 도와줘"
```

Claude Code가 이렇게 안내해줄 거예요:

```
1. .env.example 파일을 복사해서 .env.local을 만들게요
2. 각 서비스별로 필요한 키를 알려드릴게요
3. 하나씩 입력해주시면 돼요
```

### 필수 환경변수 목록

| 변수 | 서비스 | 필수 여부 |
|------|--------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | 필수 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | 필수 |
| `NEXT_PUBLIC_APP_URL` | 배포 URL | 필수 |
| `ADMIN_EMAILS` | 관리자 이메일 | 필수 |
| `LEMONSQUEEZY_API_KEY` | 결제 | 선택 |
| `RESEND_API_KEY` | 이메일 | 선택 |
| `OPENAI_API_KEY` | AI 기능 | 선택 |

> 💡 **팁**: 필수 항목만 먼저 설정하고 나중에 하나씩 추가해도 돼요!

---

## 3단계: "npm run dev 해줘" 한마디로 실행

환경변수 설정이 끝나면:

```
"의존성 설치하고 개발 서버 실행해줘"
```

Claude Code가 자동으로:

1. `npm install` 실행 (필요한 패키지 설치)
2. `npm run dev` 실행 (개발 서버 시작)
3. `http://localhost:3000` 에서 확인 가능!

```
✓ Ready in 3.2s
→ http://localhost:3000
```

브라우저에서 열어보면 완성된 랜딩 페이지가 보여요! 🎉

---

## 4단계: CLAUDE.md 파일이 뭔지

프로젝트 루트에 `CLAUDE.md` 파일이 있을 수 있어요. 이 파일은 **AI에게 주는 프로젝트 설명서**예요.

### CLAUDE.md의 역할

```
CLAUDE.md = AI를 위한 프로젝트 매뉴얼
```

이 파일에 적힌 내용을 Claude Code가 자동으로 읽고 따라요:

- 프로젝트에서 사용하는 기술 스택
- 코딩 규칙 (예: "한국어로 주석 달아줘")
- 파일 구조 설명
- 자주 하는 실수와 해결법

### 예시

```markdown
# CLAUDE.md

## 프로젝트 규칙
- TypeScript를 사용해요
- Tailwind CSS로 스타일링해요
- 컴포넌트는 src/components/ 에 만들어요
- 한국어 주석을 우선해요
```

> 💡 **팁**: CLAUDE.md에 "항상 한국어로 응답해줘"라고 적어두면, 매번 말할 필요 없이 자동으로 한국어로 답해줘요.

---

## 5단계: llm.md로 AI 온보딩 시작하기

이 프로젝트에는 특별한 파일이 하나 더 있어요: `docs/llm.md`

### llm.md란?

AI에게 "프로젝트 설정을 처음부터 끝까지 안내해줘"라고 시킬 수 있는 **온보딩 스크립트**예요.

### 사용 방법

Claude Code에서 이렇게 말해보세요:

```
"docs/llm.md 읽고 그대로 따라서 설정 도와줘"
```

그러면 AI가 자동으로:

1. 현재 설정 상태를 확인하고
2. 다음에 해야 할 단계를 알려주고
3. 하나씩 순서대로 진행해줘요

### 온보딩 순서

```
Step 0: 계정 준비 (Supabase 등)
Step 1: 로컬 환경 세팅
Step 2: 배포 (Vercel)
Step 3: 인증 (Google 로그인)
Step 4: 결제 (LemonSqueezy) - 선택
Step 5: 이메일 (Resend) - 선택
Step 6: 최종 테스트
```

> 💡 **팁**: 선택 사항은 "스킵할게"라고 말하면 AI가 관련 UI를 비활성화하는 방법도 알려줘요.

---

## 🎯 10분 런칭 체크리스트

- [ ] Git으로 프로젝트 다운로드
- [ ] Claude Code 시작 (`claude`)
- [ ] "환경변수 설정 도와줘" → 키 입력
- [ ] "개발 서버 실행해줘" → localhost 확인
- [ ] "docs/llm.md 읽고 설정 도와줘" → 단계별 진행

---

📹 **영상 촬영 포인트**

**제목:** "10분 만에 SaaS 런칭"
**길이:** 5분
**보여줄 것:**
1. 터미널에서 `git clone` 실행
2. `claude` 시작
3. "환경변수 설정 도와줘" → AI가 안내하는 모습
4. "개발 서버 실행해줘" → 자동 실행
5. 브라우저에서 완성된 랜딩 페이지 확인
6. "docs/llm.md 읽고 설정 도와줘" → 온보딩 시작

**스크립트 초안:**
> "보일러플레이트를 다운로드하고 Claude Code에게 '설정 도와줘'라고만 했는데,
> 10분 만에 이런 페이지가 완성됐어요.
> 로그인, 결제, 이메일... 전부 다 갖춰진 SaaS예요.
> 직접 코드를 한 줄도 작성하지 않았어요.
> 어떻게 했는지 처음부터 보여드릴게요!"
