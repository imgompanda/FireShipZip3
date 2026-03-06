/**
 * 통합 플랜 정보 매핑
 *
 * 기존 src/lib/lemon/plans.ts를 기반으로 확장하여
 * LemonSqueezy, Paddle, Toss 결제용 ID를 포함합니다.
 */

export interface UnifiedPlanInfo {
  /** 플랜 식별자 (slug) */
  slug: string;
  /** 플랜 이름 */
  name: string;
  /** 달러 가격 표시 */
  price: string;
  /** 한글 가격 표시 */
  priceKo: string;
  /** 숫자 가격 (달러 단위) */
  priceNumber: number;
  /** 원화 가격 (KRW) */
  priceKrw: number;
  /** 영문 기능 목록 */
  features: string[];
  /** 한글 기능 목록 */
  featuresKo: string[];

  // 프로바이더별 ID
  /** LemonSqueezy Variant ID */
  lemonVariantId: string;
  /** Paddle Price ID */
  paddlePriceId: string;
  /** 토스페이먼츠 결제 키 */
  tossPlanKey: string;
}

// 통합 플랜 정의
export const UNIFIED_PLANS: UnifiedPlanInfo[] = [
  {
    slug: "basic",
    name: "Basic",
    price: "$9/month",
    priceKo: "$9/월",
    priceNumber: 9,
    priceKrw: 9900,
    features: [
      "Supabase Auth",
      "Email Support",
      "Basic Dashboard",
      "Community Access",
      "5 Projects",
    ],
    featuresKo: [
      "Supabase 인증",
      "이메일 지원",
      "기본 대시보드",
      "커뮤니티 액세스",
      "5개 프로젝트",
    ],
    lemonVariantId:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC || "1119908",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC || "",
    tossPlanKey: process.env.NEXT_PUBLIC_TOSS_PLAN_BASIC || "",
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$29/month",
    priceKo: "$29/월",
    priceNumber: 29,
    priceKrw: 29900,
    features: [
      "Everything in Basic",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domain",
      "API Access",
      "Unlimited Projects",
      "Team Members (up to 5)",
    ],
    featuresKo: [
      "베이직의 모든 기능",
      "우선 지원",
      "고급 분석",
      "커스텀 도메인",
      "API 액세스",
      "무제한 프로젝트",
      "팀 멤버 (최대 5명)",
    ],
    lemonVariantId:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO || "1178966",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO || "",
    tossPlanKey: process.env.NEXT_PUBLIC_TOSS_PLAN_PRO || "",
  },
];

// 기본 Free 플랜
export const FREE_PLAN: Omit<
  UnifiedPlanInfo,
  "lemonVariantId" | "paddlePriceId" | "tossPlanKey"
> = {
  slug: "free",
  name: "Free",
  price: "$0/month",
  priceKo: "$0/월",
  priceNumber: 0,
  priceKrw: 0,
  features: ["Limited Access", "Community Support"],
  featuresKo: ["제한된 접근", "커뮤니티 지원"],
};

import type { PaymentProviderType } from "./types";

/**
 * 프로바이더 타입에 따라 플랜의 ID를 반환합니다.
 */
export function getPlanIdForProvider(
  plan: UnifiedPlanInfo,
  providerType: PaymentProviderType
): string {
  switch (providerType) {
    case "lemon":
      return plan.lemonVariantId;
    case "paddle":
      return plan.paddlePriceId;
    case "toss":
      return plan.tossPlanKey;
    default:
      throw new Error(`Unsupported provider type: ${providerType}`);
  }
}

/**
 * slug로 플랜 정보를 가져옵니다.
 */
export function getPlanBySlug(
  slug: string
): UnifiedPlanInfo | typeof FREE_PLAN {
  const plan = UNIFIED_PLANS.find((p) => p.slug === slug);
  return plan || FREE_PLAN;
}

/**
 * 프로바이더별 ID로 플랜 정보를 가져옵니다.
 */
export function getPlanByProviderId(
  providerId: string,
  providerType: PaymentProviderType
): UnifiedPlanInfo | typeof FREE_PLAN {
  const plan = UNIFIED_PLANS.find((p) => {
    switch (providerType) {
      case "lemon":
        return p.lemonVariantId === providerId;
      case "paddle":
        return p.paddlePriceId === providerId;
      case "toss":
        return p.tossPlanKey === providerId;
      default:
        return false;
    }
  });

  return plan || FREE_PLAN;
}
