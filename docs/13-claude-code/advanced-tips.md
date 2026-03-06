# Claude Code 파워 유저 되기

> 기본기를 익혔다면, 이제 나만의 워크플로우를 만들어봐요!

---

## 1단계: 커스텀 슬래시 커맨드 만들기

슬래시 커맨드는 자주 하는 작업을 **한 단어로** 실행하는 단축키예요.

### 프로젝트 전용 커맨드 만들기

`.claude/commands/` 폴더에 마크다운 파일을 만들면 자동으로 커맨드가 돼요.

```
.claude/
└── commands/
    ├── deploy.md       →  /project:deploy
    ├── translate.md    →  /project:translate
    └── check.md        →  /project:check
```

### 예시: 배포 커맨드

`.claude/commands/deploy.md`:

```markdown
프로젝트를 배포해줘:

1. 먼저 `npm run build`로 빌드 확인
2. 에러가 있으면 수정
3. 빌드 성공하면 `git add .` → `git commit` → `git push`
4. Vercel이 자동 배포할 거야
5. 배포 URL 알려줘
```

사용할 때:

```
/project:deploy
```

### 예시: 번역 커맨드

`.claude/commands/translate.md`:

```markdown
$ARGUMENTS 파일의 한국어 텍스트를 영어로 번역해줘.

규칙:
- messages/ko.json의 해당 키를 찾아서
- messages/en.json에 영어 번역 추가
- 자연스러운 영어로 번역 (직역 X)
```

사용할 때:

```
/project:translate HeroSection
```

---

## 2단계: 훅(Hook)으로 자동화

**훅(Hook)**은 특정 이벤트가 발생하면 자동으로 실행되는 명령어예요.

### 훅 설정 위치

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo '명령어 실행 전 체크!'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo '파일이 생성/수정됐어요'"
          }
        ]
      }
    ]
  }
}
```

### 유용한 훅 예시

#### 파일 저장 후 자동 린트

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_FILE_PATH 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

#### 위험한 명령어 차단

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'rm -rf'; then echo 'BLOCKED: 위험한 명령어!'; exit 1; fi"
          }
        ]
      }
    ]
  }
}
```

---

## 3단계: 플러그인 활용하기

Claude Code는 MCP 서버를 **플러그인처럼** 활용할 수 있어요.

### 유용한 플러그인들

| 플러그인 | 용도 | 설치 |
|----------|------|------|
| `@anthropic/claude-code-memory` | 대화 기억하기 | 내장 |
| `@supabase/mcp-server` | DB 관리 | MCP 설정 |
| `@modelcontextprotocol/server-github` | GitHub 연동 | MCP 설정 |
| `@anthropic/mcp-server-brave-search` | 웹 검색 | MCP 설정 |

### 플러그인 조합 예시

Supabase + GitHub를 동시에 연결하면:

```
"데이터베이스 스키마 변경하고, 그 내용으로 PR 만들어줘"
```

이 한마디로 AI가:
1. Supabase에서 스키마 변경
2. 관련 코드 수정
3. GitHub에 PR 생성

까지 자동으로 해줘요!

---

## 4단계: 커스텀 에이전트 만들기

`.claude/agents/` 폴더에 에이전트 설정을 만들 수 있어요.

### 폴더 구조

```
.claude/
└── agents/
    ├── reviewer.md     → 코드 리뷰 전문 에이전트
    ├── translator.md   → 번역 전문 에이전트
    └── designer.md     → UI 디자인 전문 에이전트
```

### 예시: 코드 리뷰 에이전트

`.claude/agents/reviewer.md`:

```markdown
# 코드 리뷰어 에이전트

## 역할
너는 시니어 개발자 코드 리뷰어야.

## 규칙
1. 변경된 파일을 모두 읽어
2. 아래 기준으로 리뷰해:
   - 보안 취약점 (SQL 인젝션, XSS 등)
   - 성능 이슈
   - TypeScript 타입 안정성
   - 코드 중복
3. 각 이슈에 심각도 표시 (🔴 심각 / 🟡 주의 / 🟢 제안)
4. 한국어로 리뷰 결과 정리
```

### 예시: 번역 에이전트

`.claude/agents/translator.md`:

```markdown
# 번역 에이전트

## 역할
너는 한영 번역 전문가야.

## 규칙
1. messages/ko.json의 새로운 키를 찾아
2. messages/en.json에 자연스러운 영어로 번역해서 추가
3. 직역하지 말고 영어권 사용자에게 자연스러운 표현 사용
4. 기술 용어는 번역하지 말고 그대로 유지 (예: API, Dashboard)
```

---

## 5단계: 메모리 시스템 활용하기

Claude Code는 대화 사이에도 정보를 기억할 수 있어요.

### CLAUDE.md (프로젝트 메모리)

프로젝트 루트의 `CLAUDE.md`에 적은 내용은 **매 대화마다** 자동으로 읽혀요.

```markdown
# CLAUDE.md

## 프로젝트 규칙
- 항상 한국어로 응답해요
- TypeScript strict 모드 사용
- 컴포넌트는 함수형으로 작성
- CSS는 Tailwind 유틸리티 클래스 사용

## 자주 하는 실수
- Supabase 클라이언트는 서버/클라이언트 구분해서 사용
- next-intl의 useTranslations는 클라이언트 컴포넌트에서만
```

### Auto Memory (자동 기억)

Claude Code에게 "이거 기억해줘"라고 하면 자동으로 메모리에 저장돼요:

```
"항상 커밋 메시지는 한국어로 작성해줘. 기억해줘."
```

다음 대화에서도 자동으로 적용돼요!

### 기억 관리

```
"지금 기억하고 있는 것들 보여줘"
"bun 대신 npm 쓰는 걸로 바꿔줘. 기억 업데이트해줘."
"커밋 메시지 규칙 잊어도 돼"
```

---

## 🎯 파워 유저 체크리스트

- [ ] 자주 쓰는 작업을 슬래시 커맨드로 만들기
- [ ] 위험한 명령어 차단 훅 설정하기
- [ ] Supabase MCP 연결하기
- [ ] 코드 리뷰 에이전트 만들기
- [ ] CLAUDE.md에 프로젝트 규칙 정리하기
- [ ] "기억해줘"로 반복 설정 자동화하기

---

📹 **영상 촬영 포인트**

**제목:** "나만의 워크플로우 만들기"
**길이:** 10분
**보여줄 것:**
1. 커스텀 슬래시 커맨드 만들기 (deploy.md 작성)
2. `/project:deploy` 실행 → 자동 배포
3. 훅 설정으로 자동 린트 (settings.json 수정)
4. 커스텀 에이전트 만들기 (reviewer.md 작성)
5. 에이전트로 코드 리뷰 실행
6. CLAUDE.md 작성 → 규칙 자동 적용 확인
7. "기억해줘" → 다음 대화에서 확인

**스크립트 초안:**
> "기본기를 익혔다면 이제 자기만의 워크플로우를 만들어봐요.
> 먼저 자주 쓰는 작업을 슬래시 커맨드로 만들 거예요.
> commands 폴더에 deploy.md 파일을 만들고...
> 이제 /project:deploy 한 마디면 빌드부터 배포까지 자동이에요.
>
> 다음은 훅이에요. 파일을 수정할 때마다 자동으로 코드 검사를 해주는 거죠.
> settings.json에 이렇게 설정하면...
>
> 마지막으로 CLAUDE.md! 여기에 '항상 한국어로 응답해줘'라고 적어두면,
> 매번 말할 필요 없이 AI가 자동으로 한국어로 답해줘요.
>
> 이 세 가지만 설정해두면, 여러분만의 AI 개발 환경이 완성돼요!"
