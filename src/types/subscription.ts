// 결제 프로바이더 타입
export type PaymentProviderType = "lemon" | "paddle" | "toss";

// 구독 상태 타입
export type SubscriptionStatus =
  | "active" // 정상 사용 중
  | "trialing" // 트라이얼 중
  | "past_due" // 결제 실패 (재시도 중)
  | "grace_period" // 유예 기간 (읽기 전용)
  | "unpaid" // 서비스 중단
  | "canceled" // 해지됨
  | "paused"; // 일시정지

// 구독 정보 타입
export interface Subscription {
  id: string;
  user_id: string;
  /** 결제 프로바이더 ('lemon' | 'paddle' | 'toss') */
  payment_provider: PaymentProviderType;
  // LemonSqueezy 전용
  lemon_customer_id: string | null;
  lemon_subscription_id: string | null;
  // Paddle 전용
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  // 토스페이먼츠 전용
  toss_customer_key: string | null;
  toss_billing_key: string | null;
  // 공통
  status: SubscriptionStatus;
  plan_id: string;
  plan_name: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// Webhook 이벤트 로그 타입 (LemonSqueezy)
export interface LemonWebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: "pending" | "processed" | "failed";
  error_message: string | null;
  created_at: string;
}

// Webhook 이벤트 로그 타입 (Paddle)
export interface PaddleWebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: "pending" | "processed" | "failed";
  error_message: string | null;
  processed_at: string | null;
  created_at: string;
}

// 기능 접근 권한 체크
export function canAccess(
  feature: string,
  status: SubscriptionStatus
): boolean {
  // 읽기 전용이 허용되는 상태
  const readOnlyStatuses: SubscriptionStatus[] = ["grace_period"];
  // 완전히 차단되는 상태
  const blockedStatuses: SubscriptionStatus[] = ["unpaid", "canceled"];

  if (blockedStatuses.includes(status)) {
    return false;
  }

  if (readOnlyStatuses.includes(status)) {
    // grace_period에서는 읽기만 가능
    return feature === "read";
  }

  return true;
}

// 상태별 배지 색상
export function getStatusBadgeColor(status: SubscriptionStatus): string {
  const colors: Record<SubscriptionStatus, string> = {
    active: "bg-green-500",
    trialing: "bg-blue-500",
    past_due: "bg-yellow-500",
    grace_period: "bg-orange-500",
    unpaid: "bg-red-500",
    canceled: "bg-gray-500",
    paused: "bg-purple-500",
  };
  return colors[status] || "bg-gray-500";
}

// 상태 한글 표시
export function getStatusLabel(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    active: "활성",
    trialing: "체험 중",
    past_due: "결제 실패",
    grace_period: "유예 기간",
    unpaid: "서비스 중단",
    canceled: "해지됨",
    paused: "일시정지",
  };
  return labels[status] || status;
}
