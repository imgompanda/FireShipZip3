# 04. LemonSqueezy: Payment Setup

Connect LemonSqueezy to handle **subscription payments**.

> 💡 LemonSqueezy is a **Merchant of Record** service.
> They handle taxes and VAT for you, making it easy for **businesses worldwide to accept global payments**!

---

## ⚠️ Please Read Before Starting!

### 1. Use Test Mode

During development, **always enable Test Mode**.

1. Dashboard bottom left → Toggle **Test Mode** on
2. No real payments occur in test mode
3. Test card: `4242 4242 4242 4242`

### 2. Apply for Store Approval Early

LemonSqueezy has a **store approval process**.

- Approval can take **1-5 days**
- Apply for approval **early** when you start development
- Settings → Store details → Enter required info and request approval

> 💡 **Tip**: You can continue development in Test Mode while waiting for approval!

---

## Step 1: Create Account and Set Up Store

1. Sign up at [LemonSqueezy](https://lemonsqueezy.com)
2. Create a **Store** (skip if you already have one)
3. Enter seller information
4. **Apply for store approval** (Settings → Store details)

---

## Step 2: Create Products and Pricing

1. Dashboard → **Products** → Click **New Product**
2. Enter product info:
   - **Name**: Basic Plan / Pro Plan
   - **Pricing**: Subscription
   - **Price**: Set monthly price
3. After **Save**, copy the **Variant ID**

> ⚠️ Copy the **Variant ID** for each price. You'll need it for environment variables!

---

## Step 3: Generate API Key

1. Dashboard → **Settings** → Click **API**
2. Click **Create API Key** button
3. Copy and securely save the key

Add to `.env.local`:

```bash
LEMONSQUEEZY_API_KEY=lmsq_xxxxxxxxxxxxx
```

---

## Step 4: Get Store ID

1. Dashboard → **Settings** → Click **Stores**
2. Copy the **Store ID** (number)

Add to `.env.local`:

```bash
LEMONSQUEEZY_STORE_ID=12345
```

---

## Step 5: File Descriptions

| File              | Description                                          |
| :---------------- | :--------------------------------------------------- |
| `actions.ts`      | Checkout URL generation, cancel/change subscriptions |
| `plans.ts`        | **Variant ID-based plan pricing/features**           |
| `webhook-test.md` | Webhook testing guide                                |

---

## Step 6: Plan Configuration (Auto-linked!)

`src/lib/lemon/plans.ts` **automatically reads Variant IDs from environment variables.**

✅ **Just enter the Variant IDs in `.env.local` and you're done!**

```bash
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC=123456
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=123457
```

> 💡 **When to modify `plans.ts`**:
>
> - Only when you want to change plan names, displayed prices, or feature lists
> - e.g., Change display from `$9/month` → `$19/month`

---

## Webhook Setup

Webhooks notify your app about events like payment completion and subscription changes.

> 🎯 **Recommended Order**
>
> 1. **Deploy to Vercel first** → Set up webhooks with real URL (simplest!)
> 2. If local testing is needed before deployment → Use ngrok (optional)

---

### ✅ Recommended: Set Up After Deployment

**Simplest method!** Deploy to Vercel first, then set up webhooks.

1. First deploy to Vercel (see [02-deployment](../02-deployment/))
2. Check your deployed URL (e.g., `https://myapp.vercel.app`)
3. Proceed to "Create Webhook in LemonSqueezy" step below

> 💡 **Why is this better?**
>
> - No ngrok installation/configuration needed
> - Fixed URL, no need to update every time
> - Test in the same environment as production

---

### 🔧 Advanced: Test Locally (ngrok)

> ⚠️ **Optional**: Only use when you need to test webhooks locally before deployment.

To test webhooks locally, you need an externally accessible URL.

**Install and run ngrok**:

```bash
# Mac (Homebrew)
brew install ngrok

# Windows (Chocolatey)
choco install ngrok

# Windows (Scoop)
scoop install ngrok

# Or run without installation (all OS)
npx ngrok http 3000
```

**Example output after running**:

```
Forwarding https://abc123.ngrok.io -> http://localhost:3000
```

Copy `https://abc123.ngrok.io`.

> ⚠️ **Note**: Free ngrok version **changes URL on every restart**.
> You'll need to update the URL in LemonSqueezy each time you test.

---

### Option C: If You Have Your Own Server

If using AWS, GCP, or your own VPS:

1. Deploy app to server
2. Connect domain (e.g., `api.yourdomain.com`)
3. Set up HTTPS certificate (Let's Encrypt, etc.)
4. Webhook URL: `https://api.yourdomain.com/api/webhooks/lemon`

> 💡 **Tip**: Setting up reverse proxy with Nginx or Caddy enables automatic HTTPS renewal.

### Create Webhook in LemonSqueezy

1. Dashboard → **Settings** → Click **Webhooks**
2. Click **New Webhook** button
3. Enter information:
   - **URL**:
     - Local: `https://abc123.ngrok.io/api/webhooks/lemon`
     - After deployment: `https://yourapp.vercel.app/api/webhooks/lemon`
   - **Signing secret**: Enter a secure secret key (e.g., `whsec_my_super_secret_123`)
4. Select **Events**:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_payment_success`
   - `subscription_payment_failed`
   - `subscription_paused`
   - `subscription_unpaused`
5. Click **Save**

Add to `.env.local`:

```bash
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_my_super_secret_123
```

> 💡 **Tip**: After Vercel deployment, also add to Vercel environment variables!

---

## Step 6: Add Variant ID Environment Variables

```bash
# Variant ID for each plan
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC=123456
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=123457
```

---

## Step 7: Testing

3. Test card info:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits

> 💡 **Checkout Method Guide**
>
> This boilerplate uses the most reliable **full-page redirect (Hosted Checkout)** method by default.
>
> - **Advantage**: Highest payment success rate, unaffected by browser security policies or ad blockers.
> - **Tip**: Showing a `loading` state when the button is clicked gives users confidence. (Currently implemented in `pricing/page.tsx`)

---

## 📁 Full Environment Variables Example

```bash
# LemonSqueezy
LEMONSQUEEZY_API_KEY=lmsq_xxxxxxxxxxxxx
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxxxx

# Plan Variant IDs (must be accessible on client)
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC=123456
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=123457
```

---

## 💡 Extending LemonSqueezy Features with AI

### Add New Plan

```
Add LEMONSQUEEZY_VARIANT_ENTERPRISE environment variable,
and modify src/services/lemon/actions.ts to support
Enterprise plan checkout.
```

### Add Pause Feature

```
Add pauseSubscription and resumeSubscription functions
to src/services/lemon/actions.ts.
Use the LemonSqueezy updateSubscription API.
```

---

## 💬 Troubleshooting

### Webhook Not Working

→ Check if URL is correct. If using ngrok, verify the URL hasn't changed.

### Subscription Not Created After Payment

→ Check if Webhook Secret is correct. Look for "Invalid signature" errors in the console.

### Subscription Cancellation Test Behaving Strangely

→ In **Test Mode**, `ends_at` is immediately set to current time upon cancellation, so it may become `canceled` right away.
→ In **Production**, `cancel_at_period_end` becomes `true`, and `active` status is maintained for the remaining period.

---

**Next**: [05-resend](../05-resend/) - Email Setup
