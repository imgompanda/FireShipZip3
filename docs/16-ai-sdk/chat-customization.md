# AI 채팅 커스터마이징

> 시스템 프롬프트를 바꾸면 AI의 성격이 바뀌어요. 내 서비스에 맞는 AI 어시스턴트를 만들어봐요!

---

## 1단계: 시스템 프롬프트 변경하기

### 시스템 프롬프트란?

AI에게 "너는 이런 역할이야"라고 알려주는 초기 설정이에요.

```
시스템 프롬프트 = AI의 성격 + 역할 + 규칙
```

### 설정 파일 위치

```
src/lib/ai/config.ts
```

### 기본 시스템 프롬프트

```typescript
export const AI_CONFIG = {
  systemPrompt: `너는 친절한 AI 어시스턴트야.
사용자의 질문에 도움이 되는 답변을 해줘.
한국어로 답변해줘.`,
};
```

### 커스터마이징 예시

#### 고객 서비스 봇

```typescript
export const AI_CONFIG = {
  systemPrompt: `너는 [서비스명]의 고객 지원 AI야.

규칙:
1. 항상 친절하고 전문적으로 답변해
2. 가격, 기능, 사용법에 대한 질문에 답해
3. 기술 지원이 필요한 경우 support@example.com으로 안내해
4. 모르는 건 솔직히 모른다고 해
5. 한국어와 영어 모두 지원해

우리 서비스 정보:
- 월 $29 / $99 두 가지 플랜
- 무료 체험 14일
- 이메일, 채팅 지원`,
};
```

#### 코딩 튜터

```typescript
export const AI_CONFIG = {
  systemPrompt: `너는 코딩 튜터야.

규칙:
1. 초보자 눈높이에 맞춰 설명해
2. 코드 예시를 항상 포함해
3. 단계별로 설명해
4. 비유를 적극 활용해
5. "왜" 그렇게 하는지 이유를 설명해`,
};
```

#### 쇼핑 어시스턴트

```typescript
export const AI_CONFIG = {
  systemPrompt: `너는 온라인 쇼핑 도우미야.

규칙:
1. 상품 추천을 해줘
2. 사용자 예산에 맞는 제품을 제안해
3. 비교 표를 활용해서 설명해
4. 할인 정보가 있으면 알려줘`,
};
```

> 💡 **팁**: Claude Code에게 "시스템 프롬프트를 고객 서비스 봇으로 바꿔줘"라고 말하면 자동으로 수정해줘요.

---

## 2단계: 모델 변경하기

### 사용 가능한 모델

| 모델 | 특징 | 속도 | 비용 | 추천 용도 |
|------|------|------|------|-----------|
| `gpt-4o-mini` | 가성비 최고 | 빠름 | 저렴 | 일반 채팅, FAQ |
| `gpt-4o` | 가장 똑똑 | 보통 | 보통 | 복잡한 분석, 코딩 |
| `gpt-4-turbo` | 긴 대화 지원 | 느림 | 비쌈 | 긴 문서 분석 |

### 모델 변경 방법

`src/lib/ai/config.ts`에서:

```typescript
export const AI_CONFIG = {
  model: "gpt-4o-mini",    // 기본값
  // model: "gpt-4o",      // 더 똑똑한 모델로 변경
};
```

> 💡 **팁**: 처음에는 `gpt-4o-mini`로 시작하고, 답변 품질이 아쉬우면 `gpt-4o`로 올려보세요.

---

## 3단계: 대화 설정 조정

### 응답 길이 조절

```typescript
export const AI_CONFIG = {
  maxTokens: 1000,      // 최대 응답 길이 (토큰 수)
  // 500 = 짧은 답변, 2000 = 긴 답변
};
```

### 창의성 조절 (Temperature)

```typescript
export const AI_CONFIG = {
  temperature: 0.7,     // 0.0 ~ 2.0
  // 0.0 = 정확하고 일관된 답변 (FAQ, 고객 지원)
  // 0.7 = 적당히 창의적 (일반 대화)
  // 1.5 = 매우 창의적 (브레인스토밍, 글쓰기)
};
```

### 용도별 추천 설정

| 용도 | 모델 | Temperature | Max Tokens |
|------|------|-------------|------------|
| 고객 서비스 | gpt-4o-mini | 0.3 | 500 |
| 일반 채팅 | gpt-4o-mini | 0.7 | 1000 |
| 글쓰기 도우미 | gpt-4o | 1.0 | 2000 |
| 코딩 도우미 | gpt-4o | 0.2 | 2000 |

---

## 4단계: 대화 저장 기능 추가

기본적으로 대화는 페이지를 새로고침하면 사라져요. 대화를 저장하고 싶다면 Supabase에 저장할 수 있어요.

### 데이터베이스 테이블 생성

Supabase SQL Editor에서:

```sql
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_chat_user ON chat_messages(user_id, created_at DESC);

-- RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own messages"
  ON chat_messages FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Claude Code에게 구현 요청

```
"채팅 메시지를 Supabase chat_messages 테이블에 저장하고,
페이지 로드 시 이전 대화를 불러오는 기능 추가해줘"
```

---

## 🔧 트러블슈팅

### "API key is invalid" 에러

- `.env.local`의 `OPENAI_API_KEY` 확인
- 키가 `sk-`로 시작하는지 확인
- OpenAI 결제 수단이 등록되어 있는지 확인

### 응답이 너무 느려요

- `gpt-4o` → `gpt-4o-mini`로 모델 변경
- `maxTokens` 값을 줄여보세요

### 한국어 답변이 이상해요

- 시스템 프롬프트에 "반드시 한국어로 답변해"를 추가
- `temperature`를 0.5 이하로 낮춰보세요

---

📹 **영상 촬영 포인트**

**제목:** "AI 성격 바꾸기 - 시스템 프롬프트"
**길이:** 3분
**보여줄 것:**
1. 기본 시스템 프롬프트로 대화
2. 고객 서비스 봇 프롬프트로 변경
3. 변경 후 같은 질문에 다른 답변 확인
4. 모델 변경 (gpt-4o-mini → gpt-4o) 전후 비교

**스크립트 초안:**
> "AI 채팅의 성격을 바꿔볼게요.
> config.ts 파일에서 시스템 프롬프트를 수정하면 돼요.
> 지금은 '친절한 AI'인데, '고객 서비스 봇'으로 바꿔볼게요...
> 같은 질문을 해볼까요? 완전히 다른 톤으로 답하죠?
> 내 서비스에 맞는 AI를 만들 수 있어요."
