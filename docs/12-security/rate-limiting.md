# 🚦 API 속도 제한 (Rate Limiting) 가이드

> **💡 한 줄 비유**: "회전문에 1분에 5명만 들어가기"  
> 카페에 누군가 1초에 100번씩 문을 열고 들어온다면 영업이 마비되겠죠? 속도 제한은 그런 비정상적인 행동을 차단하여 진짜 손님들을 보호합니다.

API 경로의 악용을 방지하려면 속도 제한을 설정하는 것이 좋습니다. 이 튜토리얼에서는 **Upstash**를 사용하여 API 경로에 속도 제한을 설정하는 방법을 설명합니다.

---

## 🛠️ 설정 단계

### 1. Upstash 준비

1.  [Upstash](https://upstash.com/)에 가입하세요.
2.  새로운 **Redis 데이터베이스**를 생성하세요.
3.  `.env.local` 파일에 다음 환경 변수를 추가하세요 (Upstash 콘솔에서 확인 가능):
    ```bash
    UPSTASH_REDIS_REST_URL="your_upstash_url"
    UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
    ```

### 2. 패키지 설치

터미널에서 다음 명령어를 실행하여 필요한 도구를 설치합니다:

```bash
npm install @upstash/redis @upstash/ratelimit
```

### 3. 미들웨어 설정

`src/middleware.ts` 파일을 다음과 같이 업데이트하여 특정 API 경로를 보호합니다.

```typescript
// src/middleware.ts
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 1분에 5회 요청으로 제한 설정
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

const urlsToRateLimit = ["/api/test-email", "/api/feedback"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 대상 API 경로인 경우 속도 제한 확인
  if (urlsToRateLimit.some((url) => pathname.startsWith(url))) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      // 제한 초과 시 차단 페이지로 리디렉션
      return NextResponse.redirect(new URL("/blocked", request.url));
    }
  }

  // 기존 세션 업데이트 로직 실행
  return await updateSession(request);
}
```

### 4. 차단 페이지 (Blocked Page) 만들기

사용자가 제한에 도달했을 때 보여줄 페이지를 만듭니다. `src/app/[locale]/(marketing)/blocked/page.tsx` 파일에 다음 내용을 추가하세요:

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Blocked = () => {
  const t = useTranslations("Blocked");

  return (
    <main className="relative bg-zinc-950 text-white h-screen w-full flex flex-col justify-center gap-8 items-center p-10">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
        {t("title")}
      </h1>
      <p className="text-zinc-400 text-lg">{t("description")}</p>

      <div className="flex gap-4">
        <Link
          className="px-6 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
          href="/login"
        >
          {t("login")}
        </Link>
        <Link
          className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition"
          href="/"
        >
          {t("home")}
        </Link>
      </div>
    </main>
  );
};

export default Blocked;
```

---

## 📈 알고리즘 상세

저희는 **슬라이딩 윈도우(Sliding Window)** 알고리즘을 사용하여 사용자의 IP 주소를 기반으로 요청 횟수를 제한하고 있습니다. 이 방식은 고정 윈도우 방식보다 훨씬 부드럽게 트래픽을 제어합니다.

더 자세한 설정 방법은 [Upstash Rate Limit SDK 문서](https://github.com/upstash/ratelimit)를 참조하십시오.

이제 모든 설정이 끝났습니다! API 경로가 악의적인 공격으로부터 안전하게 보호됩니다. 🎉
