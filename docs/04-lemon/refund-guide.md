# 💸 환불 처리 가이드

> 환불 정책은 사업마다 다르기 때문에, 이 보일러플레이트에는 환불 기능이 기본 포함되어 있지 않아요.  
> 하지만 필요하다면 아래 방법으로 쉽게 추가할 수 있어요!

---

## 🤔 환불, 어떻게 할 수 있나요?

LemonSqueezy에서 환불하는 방법은 **2가지**예요:

1. **대시보드에서 직접 처리** (가장 간단)
2. **API로 자동화** (고객 셀프서비스)

---

## 방법 1: 대시보드에서 직접 처리 (추천)

고객이 환불을 요청하면 LemonSqueezy 대시보드에서 직접 처리하세요.

### Step 1 - 고객 찾기

1. [LemonSqueezy Dashboard](https://app.lemonsqueezy.com) 접속
2. 좌측 메뉴 → **Orders** 또는 **Subscriptions**
3. 환불할 고객 찾기 (이메일로 검색 가능)

### Step 2 - 환불 실행

1. 해당 주문/구독 클릭
2. **Refund** 버튼 클릭
3. 금액 선택:
   - **Full refund**: 전액 환불
   - **Partial refund**: 부분 환불 (금액 입력)
4. **Confirm** 클릭

✅ 끝! 고객에게 자동으로 환불 완료 이메일이 발송돼요.

---

## 방법 2: API로 자동화 (고객 셀프서비스)

고객이 직접 환불 요청 버튼을 누르면 자동 처리되게 하고 싶다면:

### 환불 함수 만들기

```typescript
// src/services/lemon/actions.ts 에 추가

export async function refundOrder(orderId: string, amount?: number) {
  const response = await fetch(
    `https://api.lemonsqueezy.com/v1/orders/${orderId}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "orders",
          id: orderId,
          attributes: {
            // amount를 지정하면 부분 환불, 없으면 전액 환불
            ...(amount && { amount }),
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.detail || "Refund failed");
  }

  return await response.json();
}
```

### 환불 API 엔드포인트 만들기

```typescript
// src/app/api/refund/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { refundOrder } from "@/services/lemon/actions";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();

  // 주문이 해당 사용자의 것인지 확인 (보안 필수!)
  // TODO: 주문 소유권 확인 로직 추가

  try {
    const result = await refundOrder(orderId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refund failed" },
      { status: 500 }
    );
  }
}
```

---

## ⚠️ 환불 정책 고려사항

환불 기능을 추가하기 전에 정책을 먼저 정하세요:

| 질문                   | 예시 옵션                            |
| ---------------------- | ------------------------------------ |
| 환불 기간은?           | 7일 / 14일 / 30일 / 무제한           |
| 부분 환불 허용?        | 예 / 아니오                          |
| 사용량 제한?           | "기능을 X회 이상 사용하면 환불 불가" |
| 구독 해지와 동시 환불? | 현재 달 일할 계산 또는 전액 환불     |

---

## 🔔 환불 Webhook 처리

환불이 발생하면 LemonSqueezy가 webhook을 보내요. 이미 설정되어 있다면 별도 작업 불필요!

이벤트: `order_refunded`

원한다면 webhook 라우트에 추가 로직을 넣을 수 있어요:

```typescript
// src/app/api/webhooks/lemon/route.ts 에 추가

case "order_refunded": {
  // 환불 처리 로직
  // 예: 사용자 기능 제한, 이메일 발송 등
  console.log("Order refunded:", event.data.id);
  break;
}
```

---

## 📖 공식 문서

- [LemonSqueezy 환불 가이드](https://docs.lemonsqueezy.com/help/orders/refunds-order)
- [API 레퍼런스 - Refunds](https://docs.lemonsqueezy.com/api/orders#refund-an-order)

---

## 💡 Pro Tip

환불 요청이 많다면 **고객 포털**을 활용하세요!

LemonSqueezy는 자체 고객 포털을 제공해요. 고객이 직접:

- 구독 관리
- 결제 수단 변경
- 영수증 다운로드

를 할 수 있어서 CS 부담이 줄어들어요.

```typescript
// 고객 포털 URL 가져오기
const portalUrl = subscription.urls?.customer_portal;
// 이 URL을 고객에게 안내하세요
```

---

**환불은 신뢰를 쌓는 과정이에요. 명확한 정책으로 고객과 좋은 관계를 유지하세요! 🤝**
