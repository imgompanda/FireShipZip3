import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

// LemonSqueezy SDK 초기화
export function initLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY || "dummy_key",
    onError: (error) => {
      console.error("LemonSqueezy Error:", error);
    },
  });
}

// 환경변수 헬퍼
export const lemonConfig = {
  storeId: process.env.LEMONSQUEEZY_STORE_ID || "dummy_store_id",
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "dummy_secret",
};
