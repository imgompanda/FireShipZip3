# 🛡️ 보안 헤더 (Security Headers) 가이드

> **💡 한 줄 비유**: "우리 집 대문 앞의 신분증 검사관"  
> 내 웹사이트가 다른 수상한 프레임에 갇히거나(클릭재킹), 수상한 물건이 몰래 배달되는 것을 현관문에서부터 차단하는 견고한 잠금장치 모음입니다.

서비스의 보안을 한 단계 더 높이고 싶으신가요? 브라우저 기반의 다양한 공격(XSS, Clickjacking 등)을 효과적으로 방어하기 위해 `next.config.ts`에 보안 헤더를 추가하는 것을 강력히 추천합니다.

---

## 🛠️ 설정 방법 (권장 사항)

`next.config.ts` 파일의 `headers` 옵션을 사용하여 아래와 같이 설정할 수 있습니다.

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

## 📚 적용하면 좋은 주요 헤더 설명

- **Strict-Transport-Security (HSTS)**:
  - `max-age=31536000; includeSubDomains; preload`
  - HTTPS 연결을 강제하며 중간자 공격(MITM)을 방지합니다.
- **X-Frame-Options**:
  - `DENY`
  - 클릭재킹(Clickjacking) 공격을 방지하기 위해 다른 사이트의 iFrame 내에서 앱이 렌더링되는 것을 차단합니다.
- **X-Content-Type-Options**:
  - `nosniff`
  - 브라우저가 파일의 MIME 유형을 추측(Sniffing)하여 악성 스크립트를 실행하는 것을 방지합니다.
- **Referrer-Policy**:
  - `strict-origin-when-cross-origin`
  - 개인정보 보호를 위해 다른 도메인으로 이동할 때 전달되는 Referrer 정보를 엄격하게 관리합니다.
- **Permissions-Policy**:
  - `camera=(), microphone=(), geolocation=()`
  - 브라우저의 민감한 권한(카메라, 마이크 등)을 기본적으로 비활성화합니다.

## 이미지 도메인 보안

외부 이미지를 `next/image` 컴포넌트로 렌더링하려면 `next.config.ts`의 `images.remotePatterns`에 해당 도메인을 명시해야 합니다. 이는 신뢰할 수 없는 소스로부터의 이미지 로딩을 차단하는 보안 조치입니다.

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { hostname: "lh3.googleusercontent.com" }, // Google 프로필 이미지 등
  ],
},
```

## 확인 방법

브라우저 개발자 도구의 **Network** 탭에서 페이지 응답(Response) 헤더를 확인하여 위 설정들이 정상적으로 적용되었는지 확인할 수 있습니다.
