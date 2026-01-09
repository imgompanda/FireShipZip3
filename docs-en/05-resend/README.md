# 05. Resend: Email Setup

Connect Resend to send **transactional emails**.

---

## 📂 Files in This Folder

| File                               | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| **README.md**                      | Basic Resend setup (this document)               |
| **[dns-setup.md](./dns-setup.md)** | DNS setup for spam prevention (DKIM, DMARC, SPF) |

---

## Step 1: Create Resend Account

1. Sign up at [Resend](https://resend.com).
2. Free tier: **3,000 emails/month**

---

## Step 2: Generate API Key

1. Resend Dashboard → **API Keys**
2. Click **Create API Key**
3. Name: `global-saas` (or any name you prefer)
4. Permission: **Full access**
5. Click **Create** and copy the key

Add to `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## Step 3: Set Up Sending Domain

> [!IMPORTANT] > **Custom domain setup is required to avoid spam folder!**
> See 👉 [dns-setup.md](./dns-setup.md) for detailed DNS configuration

### Quick Version (For Testing)

By default, emails are sent from `onboarding@resend.dev`. This is sufficient for testing.

> ⚠️ **Caution**: Putting your Gmail address directly in `RESEND_FROM_EMAIL` will cause sending to fail.
> Before domain verification, always use `onboarding@resend.dev`. After completing the domain setup guide, you can use your own domain email address.

### Production Version (Recommended)

1. Resend Dashboard → **Domains**
2. Click **Add Domain**
3. Enter domain (e.g., `mail.yourdomain.com`)
4. Add DNS records → See [dns-setup.md](./dns-setup.md)
5. After verification, add to `.env.local`:

```bash
RESEND_FROM_EMAIL=hello@yourdomain.com
```

---

## Step 4: Testing

Email sending test:

```typescript
import { sendWelcomeEmail } from "@/services/email/actions";

// Usage example
await sendWelcomeEmail({
  email: "user@example.com",
  userName: "John Doe",
  planName: "Pro",
  locale: "en",
});
```

---

## 🎉 Automatic Welcome Email

New signups **automatically receive a welcome email**!

### How It Works

1. User logs in via Magic Link or Google OAuth
2. Session exchange in Auth Callback (`/auth/callback`)
3. If `created_at` is within 10 seconds, considered a **new user**
4. `sendWelcomeEmail()` called asynchronously (no redirect delay)

### Code Location

```
src/app/auth/callback/route.ts  ← New user detection logic
src/services/email/actions.ts   ← sendWelcomeEmail function
src/components/emails/WelcomeEmail.tsx ← Email template
```

### Want to Disable It?

Comment out the `if (isNewUser)` block in `route.ts`.

---

## 📧 Included Email Templates

| Template       | File                     | Purpose               |
| -------------- | ------------------------ | --------------------- |
| Welcome        | `WelcomeEmail.tsx`       | Signup welcome        |
| Payment Failed | `PaymentFailedEmail.tsx` | Payment failure alert |

Template location: `src/components/emails/`

---

## 💡 Modifying Email Templates with AI

Ask AI like this:

```
Modify src/components/emails/WelcomeEmail.tsx to:
- Add logo image
- Change colors to brand color (#3B82F6)
- Add social media links
```

---

## 💬 Troubleshooting

### Emails Not Sending

→ Check if `RESEND_API_KEY` is correct.

### Going to Spam Folder

→ Set up custom domain and configure SPF, DKIM, DMARC according to [dns-setup.md](./dns-setup.md).

### Emails Arriving Late

→ Check sending logs in Resend Dashboard. Usually sent within seconds.

---

**Next**: [07-ai-customization](../07-ai-customization/) - Customizing with AI (Optional)
