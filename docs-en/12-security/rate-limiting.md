# 🚦 API Rate Limiting Guide

> **💡 One-line Metaphor**: "Allowing only 5 people through the revolving door per minute."  
> If someone rushes into a café 100 times per second, business would be paralyzed, right? Rate limiting protects real customers by blocking such abnormal behavior.

To prevent abuse of API routes, it is recommended to set up rate limiting. This tutorial explains how to set up rate limiting on API routes using **Upstash**.

---

## 🛠️ Setup Steps

### 1. Prepare Upstash

1.  Sign up at [Upstash](https://upstash.com/).
2.  Create a new **Redis Database**.
3.  Add the following environment variables to your `.env.local` file (found in the Upstash console):
    ```bash
    UPSTASH_REDIS_REST_URL="your_upstash_url"
    UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
    ```

### 2. Install Packages

Run the following command in your terminal to install the necessary tools:

```bash
npm install @upstash/redis @upstash/ratelimit
```

### 3. Middleware Configuration

Update the `src/middleware.ts` file to protect specific API routes as follows:

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

// Set limit to 5 requests per minute
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

const urlsToRateLimit = ["/api/test-email", "/api/feedback"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check rate limit if it's a target API route
  if (urlsToRateLimit.some((url) => pathname.startsWith(url))) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      // Redirect to blocked page if limit exceeded
      return NextResponse.redirect(new URL("/blocked", request.url));
    }
  }

  // Execute existing session update logic
  return await updateSession(request);
}
```

### 4. Create Blocked Page

Create a page to show when a user reaches the limit. Add the following content to `src/app/[locale]/(marketing)/blocked/page.tsx`:

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

## 📈 Algorithm Details

We use the **Sliding Window** algorithm to limit requests based on the user's IP address. This method controls traffic much more smoothly than a fixed window approach.

For more detailed configuration options, refer to the [Upstash Rate Limit SDK documentation](https://github.com/upstash/ratelimit).

Everything is set up! Your API routes are now safely protected against malicious attacks. 🎉
