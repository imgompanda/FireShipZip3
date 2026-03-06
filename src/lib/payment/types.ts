/**
 * 결제 프로바이더 공통 인터페이스
 *
 * Strategy 패턴으로 LemonSqueezy, Paddle, Toss 등
 * 다양한 결제 프로바이더를 추상화합니다.
 */

// 지원되는 결제 프로바이더 타입
export type PaymentProviderType = "lemon" | "paddle" | "toss";

// 체크아웃 생성 파라미터
export interface CreateCheckoutParams {
  /** 사용자 ID (Supabase auth user id) */
  userId: string;
  /** 사용자 이메일 */
  email: string;
  /** 플랜 ID (프로바이더별 variant/price ID) */
  planId: string;
  /** 성공 시 리다이렉트 URL */
  successUrl: string;
  /** 취소 시 리다이렉트 URL */
  cancelUrl?: string;
  /** 추가 메타데이터 */
  metadata?: Record<string, string>;
}

// 체크아웃 결과
export interface CheckoutResult {
  /** 체크아웃 URL (호스티드 체크아웃 용) */
  url?: string;
  /** 클라이언트 사이드 체크아웃용 토큰/트랜잭션 ID */
  clientToken?: string;
  /** 에러 메시지 */
  error?: string;
}

// 포털 세션 결과
export interface PortalSessionResult {
  url?: string;
  error?: string;
}

// 구독 액션 결과
export interface SubscriptionActionResult {
  success?: boolean;
  error?: string;
}

// 웹훅 검증 결과
export interface WebhookVerificationResult {
  valid: boolean;
  error?: string;
}

// 정규화된 웹훅 이벤트
export interface NormalizedWebhookEvent {
  /** 원본 이벤트 ID */
  eventId: string;
  /** 정규화된 이벤트 타입 */
  eventType: NormalizedEventType;
  /** 구독 ID (프로바이더 내부 ID) */
  subscriptionId?: string;
  /** 사용자 ID */
  userId?: string;
  /** 고객 ID (프로바이더 내부 ID) */
  customerId?: string;
  /** 구독 상태 */
  status?: string;
  /** 플랜/variant ID */
  planId?: string;
  /** 플랜 이름 */
  planName?: string;
  /** 현재 결제 기간 종료일 */
  currentPeriodEnd?: string;
  /** 취소 예약 여부 */
  cancelAtPeriodEnd?: boolean;
  /** 원본 이벤트 페이로드 */
  rawPayload: Record<string, unknown>;
}

// 정규화된 이벤트 타입
export type NormalizedEventType =
  | "subscription.created"
  | "subscription.updated"
  | "subscription.canceled"
  | "subscription.paused"
  | "subscription.resumed"
  | "payment.success"
  | "payment.failed"
  | "unknown";

/**
 * 결제 프로바이더 공통 인터페이스
 *
 * 모든 결제 프로바이더(LemonSqueezy, Paddle, Toss)는
 * 이 인터페이스를 구현해야 합니다.
 */
export interface PaymentProvider {
  /** 프로바이더 타입 식별자 */
  readonly type: PaymentProviderType;

  /**
   * 체크아웃 세션을 생성합니다.
   * @returns 체크아웃 URL 또는 클라이언트 토큰
   */
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;

  /**
   * 고객 포털 URL을 생성합니다.
   * 사용자가 구독을 직접 관리할 수 있는 페이지로 이동합니다.
   */
  createPortalSession(customerId: string): Promise<PortalSessionResult>;

  /**
   * 구독을 취소합니다.
   * 현재 결제 기간이 끝나면 구독이 종료됩니다.
   */
  cancelSubscription(subscriptionId: string): Promise<SubscriptionActionResult>;

  /**
   * 취소된 구독을 재활성화합니다.
   * 결제 기간이 남아있는 경우에만 가능합니다.
   */
  reactivateSubscription(
    subscriptionId: string
  ): Promise<SubscriptionActionResult>;

  /**
   * 구독 플랜을 변경합니다 (업그레이드/다운그레이드).
   */
  changePlan(
    subscriptionId: string,
    newPlanId: string
  ): Promise<SubscriptionActionResult>;

  /**
   * 웹훅 시그니처를 검증합니다.
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ): WebhookVerificationResult;
}
