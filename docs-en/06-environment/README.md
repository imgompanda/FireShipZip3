# 02. Environment: Environment Variables Setup

Detailed explanations for all environment variables.

---

## 📁 File Location

Set these in the `.env.local` file at the project root.

```bash
cp .env.local.example .env.local
```

---

## 🔐 Supabase (Required)

| Variable                        | Description          | Where to Find                     |
| ------------------------------- | -------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Project URL | Settings → General → Project ID   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API Key       | Settings → API Keys → anon public |

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

📖 Detailed setup: [03-supabase](../03-supabase/)

---

## 💳 LemonSqueezy

| Variable                      | Description       | Where to Find                  |
| ----------------------------- | ----------------- | ------------------------------ |
| `LEMONSQUEEZY_API_KEY`        | API Key (lmsq\_)  | Settings → API                 |
| `LEMONSQUEEZY_STORE_ID`       | Store ID (number) | Settings → Stores              |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook Secret    | Entered when creating webhooks |

```bash
LEMONSQUEEZY_API_KEY=lmsq_xxx
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxx
```

### Plan Variant IDs

| Variable                     | Description           |
| ---------------------------- | --------------------- |
| `LEMONSQUEEZY_VARIANT_BASIC` | Basic Plan Variant ID |
| `LEMONSQUEEZY_VARIANT_PRO`   | Pro Plan Variant ID   |

```bash
LEMONSQUEEZY_VARIANT_BASIC=123456
LEMONSQUEEZY_VARIANT_PRO=123457
```

📖 Detailed setup: [04-lemon](../04-lemon/)

---

## 📧 Resend

| Variable            | Description    | Where to Find   |
| ------------------- | -------------- | --------------- |
| `RESEND_API_KEY`    | API Key (re\_) | API Keys page   |
| `RESEND_FROM_EMAIL` | Sender Email   | Verified domain |

```bash
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

📖 Detailed setup: [05-resend](../05-resend/)

---

## 🌐 App Settings

| Variable              | Description      | Example               |
| --------------------- | ---------------- | --------------------- |
| `NEXT_PUBLIC_APP_URL` | Deployed App URL | `https://yourapp.com` |

```bash
# Not needed locally (default: http://localhost:3000)
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

---

## 📋 Full Example

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=lmsq_xxx
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxx
LEMONSQUEEZY_VARIANT_BASIC=123456
LEMONSQUEEZY_VARIANT_PRO=123457

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=hello@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

---

## ⚠️ Important Notes

- **Never** commit `.env.local` to Git!
- It's already added to `.gitignore`.
- For production, set variables via Vercel Environment Variables.

---

**Next**: [03-supabase](../03-supabase/) - Supabase Integration
