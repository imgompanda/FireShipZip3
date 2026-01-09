// LemonSqueezy Variant ID 기반 플랜 정보 매핑
// 새 플랜을 추가할 때 이 파일을 수정하세요

export interface PlanInfo {
  name: string;
  price: string;
  priceKo: string;
  priceNumber: number; // 숫자 가격 (달러 단위)
  features: string[];
  featuresKo: string[];
}

// variant_id → 플랜 정보 매핑
// LemonSqueezy 대시보드의 Variant ID를 키로 사용
export const PLAN_CONFIG: Record<string, PlanInfo> = {
  // Basic Plan
  [process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC || "1119908"]: {
    name: "Basic",
    price: "$9/month",
    priceKo: "$9/월",
    priceNumber: 9,
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
  },

  // Pro Plan
  [process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO || "1178966"]: {
    name: "Pro",
    price: "$29/month",
    priceKo: "$29/월",
    priceNumber: 29,
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
  },
};

// 기본 Free 플랜 (구독 없는 경우)
export const FREE_PLAN: PlanInfo = {
  name: "Free",
  price: "$0/month",
  priceKo: "$0/월",
  priceNumber: 0,
  features: ["Limited Access", "Community Support"],
  featuresKo: ["제한된 접근", "커뮤니티 지원"],
};

// variant_id로 플랜 정보 가져오기
export function getPlanByVariantId(
  variantId: string | null | undefined
): PlanInfo {
  if (!variantId) return FREE_PLAN;
  return PLAN_CONFIG[variantId] || FREE_PLAN;
}
