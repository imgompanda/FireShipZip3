"use client";

import dynamic from "next/dynamic";

const CookieConsent = dynamic(
  () =>
    import("@/components/ui/cookie-consent").then((mod) => mod.CookieConsent),
  { ssr: false }
);

export function ClientWidgets() {
  return (
    <>
      <CookieConsent />
    </>
  );
}
