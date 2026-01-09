import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // DNS Prefetch 활성화 (성능)
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Clickjacking 방지
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // MIME-sniffing 방지
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer 정책
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 권한 정책 (카메라, 마이크, 위치 비활성화)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
