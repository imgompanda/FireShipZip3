# 02. Deployment: Deploy to Vercel

Deploying to Vercel gives you **HTTPS + CDN + Auto-deploy** for free.

---

## Step 1: Connect Vercel Account

1. Sign up at [Vercel](https://vercel.com).
2. Connect your GitHub account

---

## Step 2: Import Project

1. Vercel Dashboard → **Add New** → **Project**
2. Select your GitHub repository
3. Click **Import**

---

## Step 3: Configure Environment Variables

### 🎯 Easiest Method: Copy & Paste!

Vercel **auto-parses** when you paste `.env` file contents directly!

1. Copy entire `.env.local` file contents (`Ctrl+A` → `Ctrl+C`)
2. Vercel → **Settings** → **Environment Variables**
3. **Paste** in the input field (`Ctrl+V`)
4. All variables are automatically parsed and entered!
5. Click **Save**

> 💡 **Tip**: Comments (`#`) are automatically ignored, so paste as-is!

---

### Method B: Manual Input

Add directly in Vercel Dashboard → **Environment Variables** section:

| Variable                                 | Value                                         |
| ---------------------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`               | Supabase URL                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`          | Supabase anon key                             |
| `SUPABASE_SERVICE_ROLE_KEY`              | Supabase service_role key (for webhooks)      |
| `LEMONSQUEEZY_API_KEY`                   | LemonSqueezy API Key                          |
| `LEMONSQUEEZY_STORE_ID`                  | LemonSqueezy Store ID                         |
| `LEMONSQUEEZY_WEBHOOK_SECRET`            | LemonSqueezy Webhook Secret                   |
| `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC` | Basic Plan Variant ID                         |
| `NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO`   | Pro Plan Variant ID                           |
| `RESEND_API_KEY`                         | Resend API Key                                |
| `RESEND_FROM_EMAIL`                      | Sender Email                                  |
| `NEXT_PUBLIC_APP_URL`                    | Deploy URL (e.g., `https://myapp.vercel.app`) |
| `ADMIN_EMAILS`                           | Admin access emails (comma separated)         |

⚠️ **Important**: Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL after deployment!

---

## Step 4: Deploy

Click the **Deploy** button!

Your URL will be generated in 1-2 minutes. (e.g., `https://your-app.vercel.app`)

---

## 💡 Tip: Sync Environment Variables with `vercel env pull`

After setting environment variables on Vercel, if you want to use the same variables locally:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Link Vercel project
vercel link

# Download env variables → auto-generates .env.local!
vercel env pull .env.local
```

> 🔄 **Two-way sync**:
>
> - **Local → Vercel**: Use Import .env feature
> - **Vercel → Local**: Use `vercel env pull` command

> 💡 **Tip**: Using `vercel dev` auto-loads env variables into memory, making `vercel env pull` unnecessary!

---

## Step 5: Set Up LemonSqueezy Production Webhook

1. [LemonSqueezy Dashboard](https://app.lemonsqueezy.com) → **Settings** → **Webhooks**
2. Click **New Webhook**
3. Enter the following:
   - **URL**: `https://your-app.vercel.app/api/webhooks/lemon`
   - **Secret**: Same value as set in Vercel environment variables
   - **Events**:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_payment_success`
     - `subscription_payment_failed`
4. Click **Save**

---

## Step 6: Update Supabase OAuth

Supabase Dashboard → **Authentication** → **URL Configuration**:

1. **Site URL**: `https://your-app.vercel.app`
2. **Redirect URLs**: `https://your-app.vercel.app/**`

Also update **Authorized redirect URIs** in Google Cloud Console!

---

## ✅ Deployment Checklist

- [ ] Site access confirmed
- [ ] Google login test
- [ ] LemonSqueezy test payment
- [ ] Email sending test

---

## 💡 Connect Custom Domain

1. Vercel Dashboard → **Settings** → **Domains**
2. Enter your domain (e.g., `yourapp.com`)
3. Add DNS records as instructed
4. SSL certificate auto-generated!

---

## 💬 Troubleshooting

### Build Failed

→ Test `pnpm build` locally to check for errors

### Environment Variables Not Applied

→ **Redeploy** required after adding env variables on Vercel

---

**Next**: [03-supabase](../03-supabase/) - Supabase Auth Setup
