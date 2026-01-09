# Webhook Testing Guide

How to test LemonSqueezy webhooks. Methods differ between development and production environments.

---

## 🌍 Testing Methods by Environment

| Environment      | Method         | Description                                  |
| ---------------- | -------------- | -------------------------------------------- |
| **Local Dev**    | Use ngrok      | Expose local server via temporary public URL |
| **After Deploy** | Use Vercel URL | Test directly with actual deployed URL       |

---

## 🔧 Local Development Environment (Using ngrok)

Local (`localhost:3000`) is not accessible externally. You need to create a temporary public URL using **ngrok**.

### Step 1: Install ngrok

```bash
# macOS (Homebrew)
brew install ngrok

# Windows (Chocolatey)
choco install ngrok

# Or direct download
# https://ngrok.com/download
```

### Step 2: Create ngrok Account (Free)

1. Go to [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. Sign up with Google or GitHub (30 seconds!)

### Step 3: Set Up Authtoken

1. Go to [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Copy **Your Authtoken**
3. Run in terminal:

```bash
ngrok config add-authtoken paste_your_copied_token_here
```

### Step 4: Start Tunnel

```bash
# Local server must be running on port 3000
ngrok http 3000
```

You'll see output like this:

```
Forwarding   https://abcd-1234.ngrok-free.app -> http://localhost:3000
```

Copy the address **`https://abcd-1234.ngrok-free.app`**!

### Step 5: Register LemonSqueezy Webhook

1. Go to [LemonSqueezy Webhooks](https://app.lemonsqueezy.com/settings/webhooks)
2. Click **Add Webhook**
3. Configure:
   - **Callback URL**: `https://abcd-1234.ngrok-free.app/api/webhooks/lemon`
   - **Signing Secret**: Same as `LEMONSQUEEZY_WEBHOOK_SECRET` in `.env.local`
   - **Events**: Select `subscription_created`, `order_created`, etc.
4. Click **Save**

### Step 6: Send Test Webhook

1. Click **Test** button next to the saved webhook
2. Select event (e.g., `subscription_created`)
3. Click **Send Test Webhook**
4. Check for `Processing LemonSqueezy webhook...` log in local terminal!

---

## 🚀 Production Environment (Vercel, etc.)

If you have a deployed server, you can test directly without ngrok.

### Webhook URL Setup

```
https://your-app.vercel.app/api/webhooks/lemon
```

### Verify Environment Variables

Check in Vercel Dashboard → Settings → Environment Variables:

- Confirm `LEMONSQUEEZY_WEBHOOK_SECRET` is set

---

## ⚠️ Important Notes

### ngrok URL Changes Every Time!

- URL changes when you restart ngrok
- Need to update LemonSqueezy webhook URL each time you test
- **Paid plan** allows fixed domain usage

### Limitations of Test Webhook

- LemonSqueezy's "Test Webhook" button sends **fake data**
- `custom_data.user_id` is missing, so `user_id` may not save to DB
- Testing with actual payment flow is most accurate

---

## 💬 Troubleshooting

| Error                 | Cause                   | Solution                                     |
| --------------------- | ----------------------- | -------------------------------------------- |
| **401 Unauthorized**  | Webhook Secret mismatch | Check `.env.local` and LemonSqueezy settings |
| **500 Error**         | Server error            | Check terminal logs                          |
| **Connection failed** | ngrok not running       | Verify `ngrok http 3000` is running          |
| **DB not saving**     | user_id missing         | Test with actual payment                     |

---

## ✅ Testing Completion Checklist

- [ ] ngrok tunnel running
- [ ] LemonSqueezy webhook URL registered
- [ ] Test Webhook sent successfully
- [ ] `Processing LemonSqueezy webhook...` confirmed in local server logs
- [ ] Data saved in Supabase `lemon_webhook_events` table confirmed
