# 내장 아날리틱스로 방문자 추적하기

> Google Analytics, PostHog 없이 자체 분석 시스템으로 방문자를 추적해요. 데이터는 내 Supabase에 안전하게 저장되고, 외부 서비스에 한 푼도 안 나가요!

---

## 왜 직접 만든 아날리틱스인가요?

솔직히 말할게요. Google Analytics나 PostHog도 좋은 도구예요. 그런데...

### 외부 서비스의 문제점

1. **내 데이터가 남의 서버에** - GA를 쓰면 사용자 데이터가 Google 서버로 갑니다
2. **GDPR/개인정보 걱정** - 유럽 사용자가 있다면 쿠키 동의 배너 필수
3. **느려지는 사이트** - 외부 스크립트 하나가 로딩 속도를 1~2초 늦춤
4. **복잡한 설정** - GA4 설정하다가 오전이 다 가는 경험... 해보셨죠?

### 내장 아날리틱스의 장점

| | Google Analytics | PostHog | 내장 아날리틱스 |
|---|-----------------|---------|----------------|
| 비용 | 무료 (데이터 활용됨) | 무료/유료 | 무료 (내 DB) |
| 데이터 소유 | Google 소유 | PostHog 서버 | **100% 내가 소유** |
| GDPR 걱정 | 있음 | 있음 | **없음** |
| 설정 난이도 | 복잡 | 보통 | **SQL 한 번이면 끝** |
| 사이트 속도 | 영향 있음 | 영향 있음 | **영향 없음** |
| 대시보드 | analytics.google.com | app.posthog.com | **/admin/analytics** |

> 물론 대규모 서비스라면 GA나 PostHog가 필요할 수 있어요. 하지만 초기 SaaS에는 이 정도면 충분하고, 나중에 필요하면 언제든 추가할 수 있어요!

---

## 전체 흐름

```
Supabase SQL 실행 → AnalyticsProvider가 자동 추적 → /admin/analytics에서 확인
```

정말 간단하죠? 하나씩 따라가볼게요.

---

## 1단계: Supabase SQL Editor에서 테이블 생성

Supabase 대시보드에 로그인한 후, **SQL Editor**를 열어주세요.

### SQL 실행하기

아래 SQL을 **전체 복사**해서 한 번에 실행해요:

```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  event_type text NOT NULL DEFAULT 'page_view',
  event_name text,
  page_path text NOT NULL,
  page_title text,
  referrer text,
  device_type text DEFAULT 'desktop',
  browser text DEFAULT 'unknown',
  os text DEFAULT 'unknown',
  country text,
  locale text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_page_path ON analytics_events(page_path);
CREATE INDEX idx_analytics_visitor ON analytics_events(visitor_id);

-- RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON analytics_events FOR ALL USING (auth.role() = 'service_role');
```

> Run 버튼을 누르고 "Success"가 나오면 성공이에요!

---

## 2단계: 테이블 구조 이해하기

"SQL은 실행했는데, 이게 뭘 하는 건지 모르겠어요" - 괜찮아요! 하나씩 설명할게요.

### 주요 컬럼 설명

| 컬럼 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `id` | uuid | 각 이벤트의 고유 번호 | `a1b2c3d4-...` |
| `visitor_id` | text | 방문자 식별 (쿠키 기반) | `v_abc123` |
| `session_id` | text | 세션 식별 (탭/방문 단위) | `s_xyz789` |
| `event_type` | text | 이벤트 종류 | `page_view`, `click` |
| `event_name` | text | 이벤트 이름 (커스텀) | `hero_cta_click` |
| `page_path` | text | 방문한 페이지 경로 | `/ko/pricing` |
| `page_title` | text | 페이지 제목 | `가격 - FireShip` |
| `referrer` | text | 어디서 왔는지 | `https://google.com` |
| `device_type` | text | 기기 종류 | `desktop`, `mobile`, `tablet` |
| `browser` | text | 브라우저 | `Chrome`, `Safari` |
| `os` | text | 운영체제 | `macOS`, `Windows`, `iOS` |
| `country` | text | 국가 | `KR`, `US` |
| `locale` | text | 언어 설정 | `ko`, `en` |
| `utm_source` | text | UTM 소스 | `twitter`, `newsletter` |
| `utm_medium` | text | UTM 매체 | `social`, `email` |
| `utm_campaign` | text | UTM 캠페인 | `launch_2026` |
| `utm_term` | text | UTM 키워드 | `saas boilerplate` |
| `utm_content` | text | UTM 콘텐츠 | `hero_button` |
| `metadata` | jsonb | 추가 데이터 (자유 형식) | `{"plan": "pro"}` |
| `created_at` | timestamptz | 이벤트 발생 시각 | `2026-03-03 12:00:00` |

### visitor_id vs session_id

이 두 개의 차이가 헷갈릴 수 있어요:

- **visitor_id**: 같은 사람이 다시 방문해도 같은 값 (브라우저 쿠키 기반)
- **session_id**: 탭을 닫고 다시 열면 새 값 (방문 단위)

예를 들어, 김철수가 오늘 3번 방문하면:
- `visitor_id`는 모두 같음 → **고유 방문자 1명**
- `session_id`는 3개 → **세션 3개**

---

## 3단계: RLS(Row Level Security) 이해하기

보안이 중요해요! 아무나 아날리틱스 데이터를 보면 안 되겠죠?

### RLS란?

**Row Level Security**는 "누가 어떤 데이터에 접근할 수 있는지" 행(row) 단위로 제어하는 Supabase의 보안 기능이에요.

### 우리가 설정한 정책

```sql
CREATE POLICY "Service role only" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');
```

이 한 줄의 의미:

- `FOR ALL` → 읽기, 쓰기, 수정, 삭제 모든 작업에 대해
- `auth.role() = 'service_role'` → **서버(백엔드)에서만** 접근 가능

즉:
- 일반 사용자 (브라우저) → 접근 불가
- 서버의 API 라우트 (service_role 키 사용) → 접근 가능
- 관리자 대시보드도 서버를 거쳐서 데이터를 가져옴

> 이렇게 하면 아무도 직접 아날리틱스 데이터를 조회할 수 없어요. 오직 서버를 통해서만 가능!

---

## 4단계: 인덱스가 하는 일

```sql
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_page_path ON analytics_events(page_path);
CREATE INDEX idx_analytics_visitor ON analytics_events(visitor_id);
```

인덱스는 **책의 목차** 같은 거예요.

"최근 7일 페이지뷰를 보여줘" → `created_at` 인덱스가 빠르게 찾아줌
"어떤 페이지가 가장 인기 있어?" → `page_path` 인덱스가 빠르게 찾아줌
"방문자별 행동 추적" → `visitor_id` 인덱스가 빠르게 찾아줌

인덱스가 없으면 데이터가 많아질수록 쿼리가 느려져요. 미리 만들어두면 걱정 없어요!

---

## 5단계: AnalyticsProvider - 자동 추적의 비밀

SQL만 실행하면 끝이에요. 왜냐하면 이 프로젝트에는 이미 **AnalyticsProvider** 컴포넌트가 설치되어 있거든요!

### 자동으로 추적되는 것들

| 이벤트 | 설명 | 자동 여부 |
|--------|------|-----------|
| `page_view` | 페이지 방문 | 자동 |
| `click` | 버튼 클릭 | 자동 |
| 디바이스 정보 | 모바일/데스크톱 | 자동 |
| 브라우저 정보 | Chrome, Safari 등 | 자동 |
| UTM 파라미터 | 마케팅 채널 추적 | 자동 |
| 리퍼러 | 어디서 왔는지 | 자동 |

### 동작 원리

```
사용자가 페이지 방문
    ↓
AnalyticsProvider가 감지 (layout.tsx에 포함)
    ↓
visitor_id, session_id 자동 생성 (쿠키/세션스토리지)
    ↓
디바이스, 브라우저, OS 정보 수집
    ↓
URL에서 UTM 파라미터 추출
    ↓
API 엔드포인트 (/api/analytics)로 이벤트 전송
    ↓
서버에서 service_role로 Supabase에 저장
    ↓
/admin/analytics에서 확인!
```

### 커스텀 이벤트 추가하기

자동 추적 외에 특정 행동을 추적하고 싶다면:

```typescript
import { trackEvent } from "@/utils/analytics";

// CTA 버튼 클릭 추적
trackEvent("cta_click", {
  button: "hero_start",
  page: "landing"
});

// 가격 페이지 조회 추적
trackEvent("pricing_view", {
  plan: "pro",
  source: "header"
});

// 회원가입 완료 추적
trackEvent("signup_complete", {
  method: "google"
});
```

> Claude Code에게 "결제 버튼에 추적 이벤트 추가해줘"라고 말하면 자동으로 해줘요!

---

## 6단계: 관리자 대시보드에서 확인하기

### 접속 방법

1. 관리자 이메일로 로그인해요
2. 브라우저에서 `/admin/analytics` 페이지로 이동해요
3. 끝! 데이터가 보여요

### 볼 수 있는 데이터

| 지표 | 설명 |
|------|------|
| 페이지 뷰 | 총 페이지 조회 수 |
| 고유 방문자 | 중복 제거한 실제 방문자 수 |
| 세션 수 | 방문 세션 수 |
| 바운스율 | 한 페이지만 보고 떠난 비율 |
| 인기 페이지 | 가장 많이 본 페이지 Top 10 |
| 리퍼러 | 어디서 방문했는지 (Google, Twitter 등) |
| 디바이스 | 모바일 vs 데스크톱 비율 |
| 브라우저 | Chrome, Safari 등 비율 |

### 기간 필터

| 필터 | 기간 |
|------|------|
| `7d` | 최근 7일 |
| `30d` | 최근 30일 |
| `90d` | 최근 90일 |
| `ytd` | 올해 전체 |

---

## 트러블슈팅

### 데이터가 안 보여요

1. **테이블 생성 확인**: Supabase에서 `analytics_events` 테이블이 있는지 확인
2. **RLS 확인**: Row Level Security 정책이 제대로 설정됐는지 확인
3. **환경변수 확인**: `SUPABASE_SERVICE_ROLE_KEY`가 `.env.local`에 있는지 확인
4. **개발 서버 재시작**: `npm run dev`를 다시 실행

### 로컬에서 테스트하기

개발 모드에서는 콘솔에 이벤트 로그가 출력돼요:

```
[FireData] page_view { page: "/", device: "desktop" }
[FireData] hero_cta_click { button: "start" }
```

---

## 아날리틱스 스킵하기

아날리틱스가 필요 없다면, SQL 스키마를 실행하지 않으면 돼요. 테이블이 없어도 앱은 정상 동작해요 (이벤트 전송만 조용히 실패).

---

📹 **영상 촬영 포인트**

**제목:** "5분 만에 아날리틱스 설정 - GA 없이 방문자 추적하기"
**길이:** 5분
**보여줄 것:**
1. 왜 내장 아날리틱스인지 간단 설명 (GA vs 내장 비교표 보여주기)
2. Supabase 대시보드 열기 → SQL Editor 클릭
3. SQL 전체 복사 → 붙여넣기 → Run 버튼 클릭
4. "Success" 확인 → Table Editor에서 analytics_events 테이블 생성 확인
5. 로컬에서 `npm run dev` → 페이지 이곳저곳 돌아다니기
6. 브라우저 콘솔에서 `[FireData]` 이벤트 로그 보여주기
7. `/admin/analytics` 접속 → 실시간 데이터 확인
8. 기간 필터 (7d, 30d) 바꿔가면서 차트 보여주기
9. "커스텀 이벤트 추가는 trackEvent 한 줄이면 끝" 코드 보여주기

**스크립트 초안:**
> "Google Analytics 설정하느라 고생하신 분 있으시죠? GA4 이벤트 설정, 속성 만들기, 태그 매니저... 정말 복잡해요.
> 이 프로젝트에는 자체 아날리틱스가 내장되어 있어요. 외부 서비스 가입도 필요 없고, 데이터도 내 Supabase에 저장돼요.
> 설정은요? SQL 한 번만 실행하면 끝이에요. 진짜 끝이에요.
> Supabase SQL Editor를 열고... 이 SQL을 복사해서... Run!
> 자, 이제 사이트를 돌아다녀볼게요. 페이지를 클릭하고, 가격 페이지도 가보고...
> /admin/analytics에서 확인해볼까요? 와, 방문자 수, 인기 페이지, 디바이스 비율까지 전부 보여요.
> 데이터는 내 Supabase에 저장되니까 개인정보 걱정도 없어요. GDPR? 걱정 끝!
> 다음 영상에서는 이 데이터를 활용해서 마케팅 전략을 세우는 방법을 알려드릴게요!"

---

**다음**: [15-storage](../15-storage/) - Supabase 스토리지 설정
