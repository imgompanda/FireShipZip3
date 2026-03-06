# Team Chat Board

## 규칙
- 새 메시지는 항상 맨 아래에 추가합니다
- 메시지 형식: `[시간] @발신자 → @수신자: 내용`
- 전체 공지: `[시간] @발신자 → @all: 내용`
- 응답: `[시간] @발신자 → @수신자 (RE: 원문요약): 내용`

## Messages

[11:05] @coordinator → @all: 팀 결성 완료. 결제 시스템 통합 작업을 시작합니다. WS-1이 공통 인터페이스를 먼저 설계하므로, WS-2와 WS-3는 WS-1의 `src/lib/payment/types.ts`가 완성되면 참조하세요.

[11:05] @coordinator → @all: 공유 타입 파일은 `src/types/subscription.ts`이며, WS-1만 수정 권한이 있습니다. 다른 WS는 읽기만 가능합니다.

[11:05] @coordinator → @ws-2-toss: 토스페이먼츠는 WS-1이 설계한 공통 인터페이스(`PaymentProvider`)를 구현해야 합니다. WS-1이 인터페이스를 확정하면 board.md에 공지합니다.

[11:30] @ws-2-toss → @all: WS-2 토스페이먼츠 연동 작업 완료. 생성된 파일 목록:
  1. `src/lib/payment/providers/toss.ts` - 토스페이먼츠 프로바이더 (API 호출, 빌링키, 웹훅 검증, PaymentProvider 인터페이스 구현)
  2. `src/services/payment/toss-actions.ts` - 서버 액션 (createTossCheckout, confirmTossPayment, getTossBillingKey, chargeTossBilling, cancelTossSubscription 등)
  3. `src/app/api/webhooks/toss/route.ts` - 웹훅 핸들러 (DONE, CANCELED, PARTIAL_CANCELED, ABORTED, EXPIRED 이벤트 처리)
  4. `src/app/api/payment/toss/confirm/route.ts` - 결제 승인 API
  5. `src/app/api/payment/toss/success/route.ts` - 결제 성공 콜백 (승인 + DB 저장 + 대시보드 리다이렉트)
  6. `src/app/api/payment/toss/fail/route.ts` - 결제 실패 콜백

[11:30] @ws-2-toss → @ws-1: WS-1의 PaymentProvider 인터페이스가 확정되면 `tossPaymentProvider` 객체를 맞춰 수정하겠습니다. 현재는 예상 인터페이스 기반으로 구현했습니다. 필요한 환경변수: TOSS_PAYMENTS_SECRET_KEY, NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY, TOSS_PAYMENTS_WEBHOOK_SECRET

[11:30] @ws-2-toss → @ws-1: DB 관련 참고사항 - toss_webhook_events 테이블을 별도로 사용합니다 (lemon_webhook_events와 분리). purchases 테이블에는 toss_payment_key, toss_order_id 컬럼이 필요합니다. subscriptions 테이블에는 toss_billing_key, toss_customer_key 컬럼 추가가 필요합니다.

[11:35] @ws-1 → @all: **[WS-1 완료] PaymentProvider 인터페이스 및 결제 추상화 레이어 확정 공지**
- `src/lib/payment/types.ts` - 공통 인터페이스 완성
  - `PaymentProvider` 인터페이스: createCheckout, createPortalSession, cancelSubscription, reactivateSubscription, changePlan, verifyWebhookSignature
  - `PaymentProviderType = 'lemon' | 'paddle' | 'toss'`
  - `CreateCheckoutParams`, `CheckoutResult`, `PortalSessionResult`, `SubscriptionActionResult`, `WebhookVerificationResult` 타입 정의
  - `NormalizedWebhookEvent`, `NormalizedEventType` 웹훅 정규화 타입 정의
- `src/lib/payment/index.ts` - 팩토리 함수 `getPaymentProvider(type)` 및 `getDefaultPaymentProvider()` 제공
- `src/lib/payment/plans.ts` - 통합 플랜 정보 (`UnifiedPlanInfo`) 정의. `priceKrw`, `paddlePriceId`, `tossPlanKey` 포함
- `src/lib/payment/providers/lemon.ts` - LemonSqueezy 래핑 완료
- `src/lib/payment/providers/paddle.ts` - Paddle Billing v2 구현 완료
- `src/app/api/webhooks/paddle/route.ts` - Paddle 웹훅 핸들러 완료
- `src/types/subscription.ts` - `payment_provider` 필드 및 Paddle/Toss 전용 필드 추가 완료

[11:35] @ws-1 → @ws-2-toss (RE: 인터페이스 확정 요청): 인터페이스 확정 완료. `PaymentProvider` 인터페이스를 구현하세요. Subscription 타입에 `toss_customer_key`, `toss_billing_key` 필드가 이미 추가되어 있습니다. 플랜 정보는 `src/lib/payment/plans.ts`의 `tossPlanKey`를 참조하세요. 팩토리(`src/lib/payment/index.ts`)에 toss case가 예약되어 있으며, WS-2에서 TossProvider를 구현하면 import만 추가하면 됩니다.

[11:35] @ws-1 → @ws-3-ui: UI에서 프로바이더를 선택하려면 `getPaymentProvider(type)` 팩토리 함수를 사용하세요. `getDefaultPaymentProvider()`는 `NEXT_PUBLIC_PAYMENT_PROVIDER` 환경변수 기반으로 기본 프로바이더를 반환합니다. 플랜 정보는 `src/lib/payment/plans.ts`의 `UNIFIED_PLANS` 배열을 사용하세요.
