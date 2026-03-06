/**
 * 결제 프로바이더 팩토리
 *
 * PaymentProviderType에 따라 적절한 프로바이더 인스턴스를 반환합니다.
 */

import type { PaymentProvider, PaymentProviderType } from "./types";
import { LemonSqueezyProvider } from "./providers/lemon";
import { PaddleProvider } from "./providers/paddle";
import { TossProvider } from "./providers/toss";

// 프로바이더 인스턴스 캐시 (싱글턴)
const providerCache: Partial<Record<PaymentProviderType, PaymentProvider>> = {};

/**
 * 결제 프로바이더 인스턴스를 반환합니다.
 *
 * @param type - 프로바이더 타입 ('lemon' | 'paddle' | 'toss')
 * @returns PaymentProvider 인스턴스
 * @throws 지원하지 않는 프로바이더 타입인 경우 에러
 *
 * @example
 * const provider = getPaymentProvider('paddle');
 * const result = await provider.createCheckout({ ... });
 */
export function getPaymentProvider(type: PaymentProviderType): PaymentProvider {
  // 캐시된 인스턴스가 있으면 반환
  if (providerCache[type]) {
    return providerCache[type]!;
  }

  let provider: PaymentProvider;

  switch (type) {
    case "lemon":
      provider = new LemonSqueezyProvider();
      break;
    case "paddle":
      provider = new PaddleProvider();
      break;
    case "toss":
      provider = new TossProvider();
      break;
    default:
      throw new Error(`Unsupported payment provider: ${type}`);
  }

  providerCache[type] = provider;
  return provider;
}

/**
 * 환경변수에서 기본 결제 프로바이더를 가져옵니다.
 * NEXT_PUBLIC_PAYMENT_PROVIDER 환경변수를 참조합니다.
 * 설정되지 않은 경우 'lemon'을 기본값으로 사용합니다.
 */
export function getDefaultPaymentProvider(): PaymentProvider {
  const providerType = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ||
    "lemon") as PaymentProviderType;
  return getPaymentProvider(providerType);
}

// 타입 re-export
export type {
  PaymentProvider,
  PaymentProviderType,
  CreateCheckoutParams,
  CheckoutResult,
  PortalSessionResult,
  SubscriptionActionResult,
  WebhookVerificationResult,
  NormalizedWebhookEvent,
  NormalizedEventType,
} from "./types";
