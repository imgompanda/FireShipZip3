# RAG 기반 AI 챗봇 설정하기

> AI가 24시간 여러분의 서비스를 판매하고 고객 문의를 자동 처리해요!

---

## RAG 챗봇이란?

**RAG (Retrieval-Augmented Generation)** = 지식 검색 + AI 답변

일반 챗봇은 학습된 일반 지식으로만 답변하지만, RAG 챗봇은 **여러분이 등록한 지식 베이스**를 기반으로 답변해요.

```
일반 AI 챗봇: "저는 그 정보를 모릅니다"
RAG AI 챗봇: "우리 서비스의 프로 플랜은 월 $29이고, 무제한 프로젝트를 지원합니다"
```

**동작 원리:**
```
방문자 질문 입력
    ↓
질문을 벡터로 변환 (임베딩)
    ↓
지식 베이스에서 유사한 문서 검색
    ↓
검색된 문서 + 질문을 AI에게 전달
    ↓
AI가 지식 기반으로 정확한 답변 생성 (스트리밍)
```

---

## 추천 모델 (비용 효율 최적)

| 용도 | 모델 | 이유 |
|------|------|------|
| **채팅** | Gemini 2.5 Flash Lite | 빠르고 저렴, 고객 응대에 최적 |
| **임베딩** | Gemini embedding-001 (768차원) | 무료 티어 넉넉, 한국어 지원 우수 |

> Gemini 2.5 Flash Lite는 응답 속도가 빠르고 비용이 매우 저렴해서 챗봇용으로 최적이에요.
> 임베딩 768차원은 비용 효율적이면서도 검색 품질이 충분해요. (최대 3072차원까지 가능)

---

## 설정 방법

### 1단계: Gemini API 키 발급

1. [Google AI Studio](https://aistudio.google.com/apikey) 접속
2. **Create API key** 클릭
3. 키를 복사해요 (`AIzaSy...`로 시작)

> Google AI Studio는 무료 티어가 넉넉해서 테스트와 소규모 운영에 충분해요.

### 2단계: 환경변수 설정

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy여기에-복사한-키
```

### 3단계: Supabase pgvector 설정

Supabase 대시보드에서:

1. **Database** → **Extensions** 메뉴
2. `vector` 검색 → **Enable** 클릭

### 4단계: DB 스키마 실행

Supabase 대시보드 → **SQL Editor**에서 `rag-schema.sql` 내용을 복사 붙여넣기 후 실행:

```sql
-- 이 프로젝트의 docs/18-rag-chatbot/rag-schema.sql 파일 전체를 복사하세요
```

테이블 3개가 생성돼요:
- `knowledge_documents` — 지식 베이스 (임베딩 포함)
- `chatbot_conversations` — 대화 기록
- `chatbot_leads` — 수집된 리드

### 5단계: 개발 서버 실행

```bash
npm run dev
```

### 6단계: 지식 베이스 등록

1. 어드민 대시보드 접속 (`/admin/knowledge`)
2. **+ 문서 추가** 클릭
3. 서비스 소개, FAQ, 가격 정보 등을 등록
4. **전체 임베딩 생성** 클릭 → 벡터 변환 완료!

### 7단계: 확인

랜딩 페이지에서 우측 하단 채팅 버튼을 클릭하면 AI 챗봇이 동작해요!

---

## 어드민 대시보드

### Knowledge Base (`/admin/knowledge`)

지식 베이스를 관리하는 페이지예요.

| 기능 | 설명 |
|------|------|
| 문서 추가 | 제목, 내용, 카테고리 입력 |
| 카테고리 | general, service, faq, pricing |
| 임베딩 생성 | 문서를 벡터로 변환 (검색 가능하게) |
| 수정/삭제 | 문서 내용 변경 시 임베딩 자동 초기화 |

**카테고리 활용 예시:**
- `service` — "우리 서비스는 Next.js 기반 SaaS 보일러플레이트로..."
- `faq` — "환불 정책: 구매 후 7일 이내 100% 환불..."
- `pricing` — "프로 플랜은 월 $29, 엔터프라이즈는 월 $99..."
- `general` — "고객 지원 이메일: support@example.com"

### Chatbot Dashboard (`/admin/chatbot`)

챗봇 운영 현황을 확인하는 페이지예요.

| 항목 | 내용 |
|------|------|
| 총 대화 수 | 전체 챗봇 대화 세션 |
| 수집된 리드 | AI가 자동 수집한 연락처 |
| 최근 대화 | 대화 내용 미리보기 |

---

## 시스템 프롬프트 커스터마이징

AI 챗봇의 성격과 답변 스타일을 바꾸고 싶다면:

**파일:** `src/app/api/chatbot/route.ts`의 `buildSystemPrompt()` 함수

```typescript
function buildSystemPrompt(context: string): string {
  const basePrompt = `당신은 [서비스명]의 친절한 AI 상담사입니다.

## 역할
- 방문자의 질문에 친절하게 답변
- 서비스의 장점을 자연스럽게 어필
- 연락처를 자연스럽게 수집

## 답변 규칙
- 2-4문장으로 간결하게
- 방문자의 언어로 답변
- 지식 베이스에 없는 정보는 추측하지 않기`;
  // ...
}
```

Claude Code를 사용한다면:
```
"챗봇 시스템 프롬프트를 '건강 상담 봇'으로 바꿔줘.
영양제 추천과 건강 팁을 제공하도록 해줘."
```

---

## 프로젝트 파일 구조

```
src/
├── lib/ai/
│   ├── rag.ts              # 임베딩 생성 + 유사도 검색
│   ├── chunker.ts          # 문서 청킹 (긴 문서 분할)
│   └── config.ts           # RAG 설정 (모델, 차원, 임계값)
├── app/api/
│   ├── chatbot/route.ts    # 공개 챗봇 API (RAG + 스트리밍)
│   └── admin/knowledge/
│       ├── route.ts        # 지식 베이스 CRUD
│       └── embed/route.ts  # 임베딩 생성 API
├── components/chatbot/
│   ├── ChatWidget.tsx      # 플로팅 챗봇 위젯
│   ├── ChatBubble.tsx      # 채팅 버튼
│   ├── ChatModal.tsx       # 채팅 모달
│   └── ContactForm.tsx     # 리드 수집 폼
└── app/[locale]/admin/
    ├── knowledge/          # 지식 베이스 관리
    └── chatbot/            # 챗봇 대시보드
```

---

## 환경변수 정리

| 환경변수 | 필수 여부 | 용도 |
|----------|-----------|------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | **필수** | Gemini 채팅 + 임베딩 |

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy여기에-google-키
```

---

## 트러블슈팅

### 챗봇이 "503" 에러를 반환해요

- `GOOGLE_GENERATIVE_AI_API_KEY`가 `.env.local`에 있는지 확인
- 키가 `AIzaSy`로 시작하는지 확인
- 개발 서버 재시작

### 임베딩 생성이 안 돼요

- Supabase에서 `vector` 확장이 활성화됐는지 확인
- `knowledge_documents` 테이블이 존재하는지 확인
- Google AI Studio 크레딧 확인

### 챗봇 답변이 부정확해요

- 지식 베이스에 더 많은 문서를 추가하세요
- 문서 내용을 구체적이고 명확하게 작성하세요
- `src/lib/ai/config.ts`에서 `searchThreshold`를 낮춰보세요 (0.3 → 0.2)

### 응답이 느려요

- Gemini 2.5 Flash Lite는 보통 1-3초 내 응답해요
- 인터넷 연결 확인
- Supabase 리전이 가까운지 확인

---

## AI 챗봇 스킵하기

AI 챗봇이 필요 없다면:
- `GOOGLE_GENERATIVE_AI_API_KEY`를 설정하지 않으면 챗봇 API가 503을 반환하고, 위젯은 표시되지만 동작하지 않아요
- 위젯 자체를 숨기려면 Claude Code에게: `"ChatWidget 컴포넌트를 레이아웃에서 제거해줘"`

---

## 고급: 임베딩 차원 변경

기본 768차원 대신 더 높은 품질이 필요하면:

1. `src/lib/ai/config.ts`에서 `embeddingDimension`을 `3072`로 변경
2. `rag-schema.sql`의 `vector(768)`을 `vector(3072)`로 변경
3. Supabase에서 테이블 재생성
4. 모든 문서 재임베딩

> 768차원은 일반적인 SaaS 챗봇에 충분해요. 3072차원은 법률/의료 등 정밀도가 중요한 도메인에 권장해요.

---

📹 **영상 촬영 포인트**

**제목:** "내 SaaS에 AI 고객 상담 챗봇 추가하기"
**길이:** 8분
**보여줄 것:**
1. "왜 AI 챗봇이 필요한지" — 24시간 자동 응대, 리드 수집
2. Google AI Studio에서 API 키 발급
3. `.env.local`에 한 줄 추가
4. Supabase에서 pgvector 활성화 + SQL 실행
5. 어드민에서 지식 베이스 문서 등록
6. 임베딩 생성 버튼 클릭
7. 랜딩 페이지에서 챗봇 테스트 — 질문하면 지식 기반 답변!
8. 리드 수집 확인 (/admin/chatbot)
9. 시스템 프롬프트 커스터마이징 데모

**스크립트 초안:**
> "고객이 새벽 3시에 문의하면 어떻게 하시겠어요? AI 챗봇이 24시간 응대하면서 자동으로 리드까지 수집해줘요.
>
> 설정은 정말 간단해요. Google AI Studio에서 API 키 하나만 발급받으면 돼요. 그리고 .env.local에 한 줄 추가.
>
> 다음으로 Supabase에서 벡터 검색 기능을 켜고, SQL을 실행해요. 이게 AI가 여러분의 정보를 검색할 수 있게 해주는 거예요.
>
> 이제 어드민에서 지식 베이스를 등록해볼게요. 서비스 소개, FAQ, 가격 정보... 이런 걸 넣어두면 AI가 이걸 기반으로 답변해요.
>
> 임베딩 생성 버튼을 누르면... 끝! 이제 테스트해볼게요.
>
> '프로 플랜 가격이 어떻게 되나요?' 물어보면... 보세요, 방금 등록한 가격 정보를 정확하게 답변해요.
>
> 그리고 AI가 자연스럽게 연락처를 물어보면, 방문자가 이메일을 남기면 자동으로 리드로 수집돼요. 어드민 대시보드에서 확인할 수 있어요.
>
> API 키 하나로 24시간 AI 영업사원이 생긴 거예요!"

---

**다음**: [17-video-guide](../17-video-guide/) - 영상 촬영 마스터 가이드
