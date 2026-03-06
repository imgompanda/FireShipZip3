# MCP로 AI에게 데이터베이스 권한 주기

> AI가 직접 데이터베이스를 조회하고, 파일을 관리하고, 외부 API를 호출할 수 있게 해주는 MCP를 알아봐요!

---

## 🔌 MCP가 뭔지

**MCP (Model Context Protocol)**는 AI가 외부 도구를 사용할 수 있게 해주는 프로토콜이에요.

### 비유하면

```
기본 Claude Code = 눈은 있지만 손이 없는 AI (코드만 읽고 쓸 수 있음)
MCP 연결 후 = 눈 + 손 + 도구까지 있는 AI (DB, 파일, API 다 다룰 수 있음)
```

### MCP로 할 수 있는 것들

| MCP 서버 | 할 수 있는 일 |
|----------|--------------|
| Supabase | DB 조회, 테이블 생성, 데이터 수정 |
| GitHub | PR 만들기, 이슈 관리 |
| Slack | 메시지 보내기 |
| 파일 시스템 | 파일 읽기/쓰기 |
| 웹 검색 | 실시간 정보 검색 |

---

## 1단계: MCP 설정 파일 만들기

프로젝트 루트에 `.claude/` 폴더가 이미 있을 거예요. 여기에 MCP 설정 파일을 만들어요.

### 파일 구조

```
프로젝트/
├── .claude/
│   └── mcp.json    ← 이 파일을 만들어요
├── src/
└── ...
```

### 기본 설정 파일

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server",
        "--supabase-url",
        "YOUR_SUPABASE_URL",
        "--supabase-key",
        "YOUR_SUPABASE_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

> ⚠️ **주의**: `YOUR_SUPABASE_URL`과 `YOUR_SUPABASE_SERVICE_ROLE_KEY`를 실제 값으로 바꿔야 해요. `.env.local` 파일에서 확인할 수 있어요.

---

## 2단계: Supabase MCP 서버 연동

### Supabase URL과 키 찾기

`.env.local` 파일에서:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

이 두 값을 `mcp.json`에 넣어주세요.

### Claude Code 재시작

MCP 설정을 바꾼 후에는 Claude Code를 종료하고 다시 시작해야 해요:

```bash
# Esc 두 번으로 종료 후
claude
```

### 연결 확인

Claude Code에서:

```
"연결된 MCP 서버 목록 보여줘"
```

Supabase가 목록에 나오면 성공이에요!

---

## 3단계: AI가 직접 DB 다루기

이제 Claude Code에게 데이터베이스 작업을 시킬 수 있어요!

### 데이터 조회

```
"analytics_events 테이블에서 오늘 데이터 보여줘"
```

```
"가장 많이 방문한 페이지 Top 10 알려줘"
```

### 테이블 생성

```
"사용자 피드백을 저장할 테이블 만들어줘"
```

AI가 이런 SQL을 실행해줘요:

```sql
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 데이터 수정

```
"테스트 데이터 10개 넣어줘"
```

```
"오래된 로그 데이터 정리해줘"
```

> ⚠️ **주의**: AI가 데이터를 삭제하거나 수정하기 전에 확인을 요청할 거예요. 꼭 내용을 확인한 후 승인하세요!

---

## 4단계: 실전 활용 시나리오

### 시나리오 1: 아날리틱스 데이터 분석

```
"이번 주 방문자 수 추이를 분석해줘"
```

AI가 직접 DB에서 데이터를 꺼내서 분석 결과를 알려줘요.

### 시나리오 2: 사용자 관리

```
"최근 가입한 사용자 5명 보여줘"
```

### 시나리오 3: 스키마 확인

```
"현재 데이터베이스에 어떤 테이블들이 있는지 보여줘"
```

---

## 🔐 보안 주의사항

MCP는 강력한 만큼 보안에 주의해야 해요.

| 해야 할 것 | 하지 말아야 할 것 |
|-----------|-----------------|
| Service Role Key는 로컬에서만 사용 | 키를 Git에 커밋하지 않기 |
| `.claude/mcp.json`을 `.gitignore`에 추가 | 프로덕션 DB에 직접 연결하지 않기 |
| 데이터 삭제 전 항상 확인 | 다른 사람에게 키 공유하지 않기 |

### .gitignore에 추가

```
# .gitignore
.claude/mcp.json
```

---

## 💡 추가 MCP 서버들

Supabase 외에도 다양한 MCP 서버를 연결할 수 있어요:

### GitHub MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```

활용 예:
```
"이 변경사항으로 PR 만들어줘"
"열려있는 이슈 목록 보여줘"
```

### 웹 검색 MCP

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

활용 예:
```
"Next.js 15 새로운 기능 검색해줘"
"Tailwind CSS v4 마이그레이션 가이드 찾아줘"
```

---

📹 **영상 촬영 포인트**

**제목:** "AI가 직접 데이터베이스 다루기"
**길이:** 5분
**보여줄 것:**
1. `mcp.json` 파일 생성 과정
2. Supabase URL/Key 복사해서 붙여넣기
3. Claude Code 재시작
4. "테이블 목록 보여줘" → AI가 직접 DB 조회
5. "피드백 테이블 만들어줘" → SQL 자동 생성 및 실행
6. "테스트 데이터 넣어줘" → 데이터 삽입

**스크립트 초안:**
> "지금까지 AI는 코드만 읽고 쓸 수 있었는데요,
> MCP를 연결하면 AI가 직접 데이터베이스를 다룰 수 있어요.
> 설정은 간단해요. mcp.json 파일 하나만 만들면 돼요.
> Supabase URL과 키를 넣어주고... Claude Code를 다시 시작하면...
> 이제 '테이블 목록 보여줘'라고 말해볼게요.
> 와, AI가 직접 데이터베이스에 접속해서 정보를 가져왔어요!
> 새 테이블도 만들어볼까요? '피드백 테이블 만들어줘'...
> 네, 이렇게 코드 작성 없이 데이터베이스까지 관리할 수 있어요."
