# 📧 DNS Setup Guide (Email Spam Prevention)

**DNS record configuration** is essential to prevent emails from going to spam.

> [!WARNING] > **You need to own a domain for this setup!**  
> If you don't have a domain, purchase one from [Namecheap](https://namecheap.com), [GoDaddy](https://godaddy.com), or similar providers first.

---

## 🤔 Why is DNS Setup Needed?

Email servers verify "Is this email really sent from this domain?"  
No DNS records → Judged as suspicious → **Moved to spam** 😭

With proper setup:

- ✅ Avoid spam folder
- ✅ Improved email delivery rate
- ✅ Increased brand credibility

---

## 📋 DNS Records to Set Up

| Record    | Purpose                                | Required       |
| --------- | -------------------------------------- | -------------- |
| **SPF**   | "Only emails from this IP are real"    | ✅             |
| **DKIM**  | "If this signature exists, not forged" | ✅             |
| **DMARC** | "Handle SPF/DKIM failures like this"   | ⭐ Recommended |

---

## 🔧 Step 1: Add Domain in Resend

1. [Resend Dashboard](https://resend.com/domains) → **Domains**
2. Click **Add Domain**
3. Enter domain:
   - Subdomain recommended: `mail.yourdomain.com` or `send.yourdomain.com`
   - Main domain also works: `yourdomain.com`

> 💡 **Why use subdomain**: Doesn't affect the main domain's email settings.

---

## 🔧 Step 2: Add DNS Records

Add the records shown by Resend to your **DNS management panel**.

### Where to Add?

| Domain Registrar | DNS Management Location        |
| ---------------- | ------------------------------ |
| Namecheap        | Domain List → Advanced DNS     |
| GoDaddy          | My Products → DNS → Manage DNS |
| Cloudflare       | DNS → Records                  |
| AWS Route53      | Hosted zones → Select domain   |

### Records to Add

Copy and paste the values shown in Resend Dashboard:

#### 1. SPF Record (TXT)

```
Type: TXT
Name: @ (or subdomain)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600 (or Auto)
```

#### 2. DKIM Records (CNAME)

Add the 3 CNAME records provided by Resend:

```
Type: CNAME
Name: resend._domainkey
Value: (value provided by Resend)
TTL: 3600

Type: CNAME
Name: resend2._domainkey
Value: (value provided by Resend)
TTL: 3600

Type: CNAME
Name: resend3._domainkey
Value: (value provided by Resend)
TTL: 3600
```

#### 3. DMARC Record (TXT) - Recommended

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:your@email.com
TTL: 3600
```

> 💡 `p=none` is monitoring mode. You can change to `p=quarantine` or `p=reject` later.

---

## 🔧 Step 3: Verify Authentication

1. After adding DNS records, wait **5 minutes to 48 hours** (usually 5 minutes is enough)
2. Resend Dashboard → Domains → Click **Verify**
3. All records showing ✅ green means success!

---

## ✅ Checklist

- [ ] Added domain to Resend?
- [ ] Added SPF record?
- [ ] Added 3 DKIM records?
- [ ] Added DMARC record? (recommended)
- [ ] All records Verified in Resend?
- [ ] Set `RESEND_FROM_EMAIL` in `.env.local`?

---

## 🧪 Testing

After setup, send a test email:

1. Send email to your Gmail
2. Open email in Gmail
3. Click three-dot menu → **"Show original"**
4. Check for:
   - `SPF: PASS` ✅
   - `DKIM: PASS` ✅
   - `DMARC: PASS` ✅

---

## 💬 Troubleshooting

### DNS not updating

→ DNS propagation can take up to 48 hours. Usually 5 minutes, but wait it out.

### SPF is FAIL

→ Check if SPF record is correct. If existing SPF exists, merge them:

```
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

### DKIM is FAIL

→ Check if CNAME values are copied exactly. No leading/trailing spaces allowed.

---

## 🔗 Reference Links

- [Resend Official DNS Guide](https://resend.com/docs/dashboard/domains/introduction)
- [SPF Record Checker](https://mxtoolbox.com/spf.aspx)
- [DKIM Record Checker](https://mxtoolbox.com/dkim.aspx)

---

**Setup complete!** Now your emails will be delivered properly 📬
