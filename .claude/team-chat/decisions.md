# Team Decisions

코디네이터가 내린 결정 사항을 기록합니다. 모든 워크스트림은 이 파일을 정기적으로 확인해야 합니다.

## DEC-001: 결제 프로바이더 추상화 패턴
- 일시: 2026-03-06 11:05
- 요청자: coordinator
- 결정: Strategy 패턴으로 결제 프로바이더를 추상화. 각 프로바이더는 `PaymentProvider` 인터페이스를 구현
- 사유: 기존 LemonSqueezy 코드를 최소한으로 변경하면서 Paddle/토스를 추가하기 위함
- 영향: WS-1 (인터페이스 설계), WS-2 (토스 구현), WS-3 (UI에서 프로바이더 선택)

## DEC-002: subscriptions 테이블에 provider 필드 추가
- 일시: 2026-03-06 11:05
- 요청자: coordinator
- 결정: `subscriptions` 테이블에 `payment_provider` 컬럼 추가 ('lemon' | 'paddle' | 'toss')
- 사유: 동일 사용자가 다른 프로바이더로 결제할 수 있어야 함
- 영향: WS-1 (타입 수정), WS-2 (토스 구독 저장 시 사용), WS-3 (UI 표시)

## DEC-003: 토스페이먼츠 원화 가격 지원
- 일시: 2026-03-06 11:05
- 요청자: coordinator
- 결정: 토스페이먼츠 사용 시 원화(KRW) 가격을 별도로 정의. plans.ts에 `priceKrw` 필드 추가
- 사유: 한국 사용자 대상 원화 결제 지원 필요
- 영향: WS-1 (plans.ts 수정), WS-2 (토스 결제 시 원화 사용), WS-3 (UI에서 원화 표시)
