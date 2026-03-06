# 플랜: 결제 시스템 통합 (Paddle + 토스페이먼츠)

- 생성일시: 2026-03-06 11:05
- 상태: 진행중
- 워크스트림 수: 3

## 전체 목표
기존 LemonSqueezy 결제 시스템 위에 Paddle과 토스페이먼츠를 선택형 결제 프로바이더로 추가한다.
사용자가 결제 시 프로바이더를 선택할 수 있고, 각 프로바이더의 웹훅/결제 추적이 통합 관리된다.

## 현재 구조 분석
- 결제 클라이언트: `src/lib/lemon/client.ts`
- 플랜 정의: `src/lib/lemon/plans.ts`
- 서버 액션: `src/services/lemon/actions.ts`
- 웹훅 핸들러: `src/app/api/webhooks/lemon/route.ts`
- 구독 타입: `src/types/subscription.ts`
- 프라이싱 UI: `src/app/[locale]/pricing/page.tsx`
- 구독 페이지: `src/app/[locale]/(dashboard)/subscription/page.tsx`
- DB 테이블: subscriptions, purchases, lemon_webhook_events (Supabase)

## 일관성 제약조건
- 공유 파일: `src/types/subscription.ts` (WS-1만 수정), `src/lib/lemon/plans.ts` (WS-1만 수정)
- 네이밍 컨벤션: camelCase (변수/함수), PascalCase (컴포넌트/타입), kebab-case (파일명은 기존 패턴 유지)
- 코드 스타일: TypeScript strict, Next.js App Router 패턴, server actions 사용
- i18n: next-intl 사용, 한/영 지원
- UI: shadcn/ui 컴포넌트 사용

## 워크스트림

### WS-1: 결제 추상화 레이어 + Paddle 연동
- 담당: Agent-1
- 상태: 대기
- 설명:
  1. 결제 프로바이더 공통 인터페이스 설계 (`src/lib/payment/types.ts`)
  2. 기존 LemonSqueezy를 인터페이스에 맞게 래핑 (`src/lib/payment/providers/lemon.ts`)
  3. Paddle 프로바이더 구현 (`src/lib/payment/providers/paddle.ts`)
  4. Paddle 웹훅 핸들러 (`src/app/api/webhooks/paddle/route.ts`)
  5. 프로바이더 팩토리/레지스트리 (`src/lib/payment/index.ts`)
  6. subscription 타입 확장 (provider 필드 추가)
- 산출물:
  - `src/lib/payment/types.ts` — 공통 인터페이스
  - `src/lib/payment/index.ts` — 프로바이더 팩토리
  - `src/lib/payment/providers/lemon.ts` — LemonSqueezy 래퍼
  - `src/lib/payment/providers/paddle.ts` — Paddle 프로바이더
  - `src/app/api/webhooks/paddle/route.ts` — Paddle 웹훅
  - `src/types/subscription.ts` 수정 — provider 필드 추가
- 의존성: 없음

### WS-2: 토스페이먼츠 연동
- 담당: Agent-2
- 상태: 대기
- 설명:
  1. 토스페이먼츠 프로바이더 구현 (`src/lib/payment/providers/toss.ts`)
  2. 토스 결제 서버 액션 (`src/services/payment/toss-actions.ts`)
  3. 토스 웹훅 핸들러 (`src/app/api/webhooks/toss/route.ts`)
  4. 토스 결제 확인(승인) API 라우트 (`src/app/api/payment/toss/confirm/route.ts`)
  5. 한국 결제 특화 처리 (원화 가격, 가상계좌, 카드 결제 등)
- 산출물:
  - `src/lib/payment/providers/toss.ts` — 토스 프로바이더
  - `src/services/payment/toss-actions.ts` — 토스 서버 액션
  - `src/app/api/webhooks/toss/route.ts` — 토스 웹훅
  - `src/app/api/payment/toss/confirm/route.ts` — 결제 승인 API
- 의존성: WS-1 (공통 인터페이스 사용)

### WS-3: 결제 선택 UI + 결제 추적
- 담당: Agent-3
- 상태: 대기
- 설명:
  1. 결제 프로바이더 선택 컴포넌트 (`src/components/features/payment/PaymentProviderSelector.tsx`)
  2. 프라이싱 페이지 리팩토링 — 프로바이더 선택 통합
  3. 결제 추적 이벤트 통합 (`src/lib/payment/tracker.ts`)
  4. 어드민 결제 대시보드 확장 (`src/app/[locale]/admin/payments/page.tsx`)
  5. i18n 메시지 추가 (결제 관련 한/영)
- 산출물:
  - `src/components/features/payment/PaymentProviderSelector.tsx`
  - `src/components/features/payment/PaymentMethodCard.tsx`
  - `src/lib/payment/tracker.ts` — 결제 이벤트 추적
  - `src/app/[locale]/admin/payments/page.tsx` — 결제 관리 대시보드
  - 프라이싱 페이지 수정
- 의존성: WS-1 (공통 인터페이스), WS-2 (토스 프로바이더)

## 충돌 해결 규칙
- `src/types/subscription.ts`: WS-1만 수정 가능
- `src/lib/payment/types.ts`: WS-1이 생성, 다른 WS는 읽기만
- API 인터페이스 변경 시: board.md에 즉시 공유
- 테스트 실패 시: 해당 워크스트림 일시정지 후 원인 분석

## 결과 집계
- [ ] 모든 워크스트림 완료
- [ ] 충돌 해결 완료
- [ ] 통합 테스트 통과
- [ ] 최종 리포트 생성
