# 🛡️ Security Headers Guide

> **💡 One-line Metaphor**: "The ID checker at our front door."  
> It's a set of robust locks that block your website from being trapped in suspicious frames (Clickjacking) or having suspicious items secretly delivered from the entrance.

Want to take your service's security to the next level? To effectively defend against various browser-based attacks (XSS, Clickjacking, etc.), we strongly recommend adding security headers to `next.config.ts`.

---

## 🛠️ Setup Method (Recommended)

You can configure it using the `headers` option in the `next.config.ts` file as shown below.

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 📚 Description of Major Headers to Apply

- **Strict-Transport-Security (HSTS)**:
  - `max-age=31536000; includeSubDomains; preload`
  - Forces HTTPS connection and prevents Man-in-the-Middle (MITM) attacks.
- **X-Frame-Options**:
  - `DENY`
  - Blocks your app from being rendered inside an iFrame on other sites to prevent Clickjacking attacks.
- **X-Content-Type-Options**:
  - `nosniff`
  - Prevents browsers from guessing (sniffing) the MIME type of a file to execute malicious scripts.
- **Referrer-Policy**:
  - `strict-origin-when-cross-origin`
  - Strictly manages Referrer information sent when moving to other domains for privacy protection.
- **Permissions-Policy**:
  - `camera=(), microphone=(), geolocation=()`
  - Disables sensitive browser permissions (camera, microphone, etc.) by default.

## Image Domain Security

To render external images using the `next/image` component, you must specify the domain in `images.remotePatterns` in `next.config.ts`. This is a security measure to block image loading from untrusted sources.

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { hostname: "lh3.googleusercontent.com" }, // Google profile images, etc.
  ],
},
```

## How to Verify

You can verify that the above settings are applied correctly by checking the page Response headers in the **Network** tab of your browser's Developer Tools.
