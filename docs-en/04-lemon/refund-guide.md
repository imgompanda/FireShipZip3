# 💸 Refund Processing Guide

> Refund policies vary by business, so this boilerplate doesn't include refund functionality by default.  
> But if needed, you can easily add it using the methods below!

---

## 🤔 How Can I Process Refunds?

There are **2 ways** to refund in LemonSqueezy:

1. **Process directly in dashboard** (simplest)
2. **Automate via API** (customer self-service)

---

## Method 1: Process Directly in Dashboard (Recommended)

When a customer requests a refund, process it directly in the LemonSqueezy dashboard.

### Step 1 - Find Customer

1. Go to [LemonSqueezy Dashboard](https://app.lemonsqueezy.com)
2. Left menu → **Orders** or **Subscriptions**
3. Find the customer to refund (can search by email)

### Step 2 - Execute Refund

1. Click on the order/subscription
2. Click **Refund** button
3. Select amount:
   - **Full refund**: Complete refund
   - **Partial refund**: Partial refund (enter amount)
4. Click **Confirm**

✅ Done! A refund confirmation email is automatically sent to the customer.

---

## Method 2: Automate via API (Customer Self-Service)

If you want automatic processing when customers click a refund request button:

### Create Refund Function

```typescript
// Add to src/services/lemon/actions.ts

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
            // If amount specified, partial refund; otherwise full refund
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

### Create Refund API Endpoint

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

  // Verify order belongs to this user (security essential!)
  // TODO: Add order ownership verification logic

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

## ⚠️ Refund Policy Considerations

Define your policy before adding refund functionality:

| Question                  | Example Options                        |
| ------------------------- | -------------------------------------- |
| Refund period?            | 7 days / 14 days / 30 days / Unlimited |
| Allow partial refunds?    | Yes / No                               |
| Usage limits?             | "No refund if feature used X+ times"   |
| Refund with cancellation? | Pro-rate current month or full refund  |

---

## 🔔 Refund Webhook Handling

LemonSqueezy sends a webhook when refunds occur. No additional work needed if already set up!

Event: `order_refunded`

You can add custom logic to the webhook route if desired:

```typescript
// Add to src/app/api/webhooks/lemon/route.ts

case "order_refunded": {
  // Refund processing logic
  // e.g., limit user features, send email, etc.
  console.log("Order refunded:", event.data.id);
  break;
}
```

---

## 📖 Official Documentation

- [LemonSqueezy Refund Guide](https://docs.lemonsqueezy.com/help/orders/refunds-order)
- [API Reference - Refunds](https://docs.lemonsqueezy.com/api/orders#refund-an-order)

---

## 💡 Pro Tip

If you get many refund requests, utilize the **Customer Portal**!

LemonSqueezy provides its own customer portal. Customers can:

- Manage subscriptions
- Change payment methods
- Download receipts

This reduces CS burden.

```typescript
// Get customer portal URL
const portalUrl = subscription.urls?.customer_portal;
// Share this URL with customers
```

---

**Refunds build trust. Maintain good customer relationships with clear policies! 🤝**
