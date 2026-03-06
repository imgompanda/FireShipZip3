# 플랜: DaisyUI 시맨틱 클래스 마이그레이션

- 생성일시: 2026-03-06 12:30
- 상태: 진행중
- 워크스트림 수: 3

## 전체 목표
FireShipZip3 보일러플레이트의 하드코딩된 zinc 색상을 DaisyUI 시맨틱 클래스로 전환

## 일관성 제약조건
- 변환 규칙:
  - bg-zinc-50, bg-white -> bg-base-100
  - bg-zinc-100, bg-zinc-200 -> bg-base-200
  - bg-zinc-800, bg-zinc-900, bg-zinc-950 -> bg-base-200 or bg-base-300
  - text-zinc-900, text-white -> text-base-content
  - text-zinc-600, text-zinc-500 -> text-base-content/70
  - text-zinc-400, text-zinc-300 -> text-base-content/50
  - border-zinc-200, border-zinc-100 -> border-base-300
  - border-zinc-800, border-zinc-700 -> border-base-content/20
  - dark: 접두사 제거 (DaisyUI가 테마로 자동 처리)
- purple/blue 강조색은 primary로 변환
- #FFBE1A 직접 사용은 유지 (이미 primary와 동일)
- backdrop-blur, shadow, transition 등 비색상 클래스는 유지
- hover 상태: hover:bg-base-200, hover:bg-base-300 등으로 변환

## 워크스트림

### WS-1: 대시보드/레이아웃
- 담당: Agent-1
- 상태: 대기
- 파일:
  - src/components/features/dashboard/DashboardSidebar.tsx (61개)
  - src/components/shared/Header.tsx (14개)
  - src/app/[locale]/admin/layout.tsx
- 산출물: DaisyUI 시맨틱 클래스 적용된 파일들

### WS-2: 랜딩/마케팅
- 담당: Agent-2
- 상태: 대기
- 파일:
  - src/components/features/payment/PricingSection.tsx (16개)
  - src/components/landing/EmailCaptureModal.tsx (8개)
  - src/components/ui/animated/AnimatedHero.tsx (8개)
  - src/components/landing/AIPromptAnimation.tsx (5개)
  - src/components/landing/MobileStickyCTA.tsx (4개)
  - src/components/landing/DrawSVGDemo.tsx (3개)
- 산출물: DaisyUI 시맨틱 클래스 적용된 파일들

### WS-3: 결제/유틸리티
- 담당: Agent-3
- 상태: 대기
- 파일:
  - src/components/features/payment/PaymentMethodCard.tsx (12개)
  - src/components/ui/animated/FeatureCard.tsx (11개)
  - src/components/ui/feedback-widget.tsx (6개)
  - src/components/ui/cookie-consent.tsx (5개)
  - src/components/features/payment/PaymentProviderSelector.tsx (2개)
  - src/components/ui/animated/ParallaxBackground.tsx (1개)
- 산출물: DaisyUI 시맨틱 클래스 적용된 파일들

## 결과 집계
- [ ] 모든 워크스트림 완료
- [ ] 충돌 해결 완료
- [ ] 최종 리포트 생성
