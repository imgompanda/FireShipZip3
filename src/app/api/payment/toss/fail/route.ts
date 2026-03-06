import { NextRequest, NextResponse } from "next/server";

/**
 * 토스페이먼츠 결제 실패 콜백 핸들러
 *
 * 토스 SDK에서 결제 실패 시 이 URL로 리다이렉트됩니다.
 * 쿼리 파라미터: code, message, orderId
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code") || "UNKNOWN_ERROR";
  const message = searchParams.get("message") || "결제에 실패했습니다";
  const orderId = searchParams.get("orderId") || "";

  const origin = req.nextUrl.origin;

  console.error(
    `Toss payment failed - code: ${code}, message: ${message}, orderId: ${orderId}`
  );

  // 에러 정보와 함께 대시보드로 리다이렉트
  const errorParams = new URLSearchParams({
    error: "payment_failed",
    code,
    message,
  });

  return NextResponse.redirect(
    `${origin}/dashboard?${errorParams.toString()}`
  );
}
