# 00. Overview: Project Introduction

---

## 👋 Hello, I'm FreAiner

Over the past year, I've launched **7 apps and 6 SaaS products** solo.

Along the way, I realized something:  
Even with great ideas... **there's just too much beyond coding that needs attention**.

> "How do I implement login?"  
> "Payment integration... Stripe doesn't work in Korea?"  
> "What about email sending? Deployment?"

**That feeling of being overwhelmed before even starting** — you know it, right?

Honestly, I've abandoned quite a few projects because of these issues.  
The "hmm... how do I do this..." moments that just fizzled out.

So I started building **my own template**.  
Once I set it up properly, I could **quickly implement ideas without stress**.

I wanted to share this template with **beginner developers and solo builders**.  
I've tried to explain everything as simply as possible — follow along at your own pace!

---

## 🤖 Using AI Coding Tools?

Do you use AI coding tools like **Cursor**, **Windsurf**, or **Claude Code**?

If so, just attach this one file to your AI:

```
📎 docs/llm.md
```

> Just say **"Help me set up according to this document"**,  
> and the AI will guide you step by step!

`llm.md` contains all instructions for the AI:

- What order to follow
- Which documents to reference at each step
- Common errors and solutions
- Style guide for friendly explanations

You can proceed alone or with AI assistance.  
Either way, **these docs are designed to be easy to follow**!

---

Alright, let's take a look at what this template is made of! 👇

---

## 🎯 What is this Boilerplate?

**Global SaaS Starter Kit** is a template for building SaaS quickly.

Features like login, payments, and email are **already implemented**,  
so you can **focus solely on core feature development**.

---

## 🔧 Services Used

### 1. Supabase

**One-liner**: Open-source Firebase alternative. Provides database + authentication.

**Why use it?**

- Implement Google, GitHub login in 5 minutes
- Create PostgreSQL database with a few clicks
- Free tier available

**What it does in this project**:

- 🔐 **User Authentication** (Google OAuth, Magic Link)
- 🗄️ **Data Storage** (user info, subscription status)
- 🔒 **Security** (Row Level Security for data protection)

🔗 [Supabase Official Site](https://supabase.com)

---

### 2. LemonSqueezy

**One-liner**: Global payment service that works for Korean businesses.

**Why use it?**

- **Korean business support** (no separate corporation needed unlike Stripe)
- **Merchant of Record**: Handles taxes and VAT for you
- Subscription management, customer portal included

**What it does in this project**:

- 💳 **Payment Processing** (checkout overlay)
- 📅 **Subscription Management** (renewal, cancellation, plan changes)
- 📧 **Automatic Receipt Sending**
- 🔔 **Webhooks** (notify server of payment events)

🔗 [LemonSqueezy Official Site](https://lemonsqueezy.com)

---

### 3. Resend

**One-liner**: Developer-friendly email sending service.

**Why use it?**

- Create beautiful emails easily with React components
- High delivery rate (avoids spam folder)
- Free tier: 3,000 emails/month

**What it does in this project**:

- 📬 **Welcome Email** sending
- ⚠️ **Payment Failure Alerts**
- 📝 **Custom Email Templates**

🔗 [Resend Official Site](https://resend.com)

---

### 4. Vercel

**One-liner**: Hosting service from the company that created Next.js.

**Why use it?**

- Auto-deploy with just git push
- HTTPS, CDN all free
- Serverless — no server management needed

**What it does in this project**:

- 🚀 **Website Hosting**
- 🌍 **Fast Loading via Global CDN**
- 🔄 **Auto Deployment** (GitHub integration)

🔗 [Vercel Official Site](https://vercel.com)

---

## 📁 Tech Stack Summary

| Category       | Technology               | Description              |
| -------------- | ------------------------ | ------------------------ |
| **Framework**  | Next.js 16               | React + Server Rendering |
| **Styling**    | Tailwind CSS + shadcn/ui | Rapid UI Development     |
| **Auth/DB**    | Supabase                 | PostgreSQL + OAuth       |
| **Payments**   | LemonSqueezy             | Subscription Payments    |
| **Email**      | Resend + React Email     | Transactional Emails     |
| **Deployment** | Vercel                   | Serverless Hosting       |
| **i18n**       | next-intl                | Korean/English Support   |
| **State**      | Zustand                  | Lightweight Global State |

---

## ⚠️ Before You Start (Required!)

> [!IMPORTANT] > **Complete these steps before proceeding to the next guides!**  
> Each service signup takes time, so do it now.

1. **Create Supabase Account** → [supabase.com](https://supabase.com)
2. **Create LemonSqueezy Account** → [lemonsqueezy.com](https://lemonsqueezy.com)
   - ⚡ **Store approval takes 1-5 days** — apply early!
3. **Create Resend Account** → [resend.com](https://resend.com)
4. **Create Vercel Account** (for deployment) → [vercel.com](https://vercel.com)

✅ All can start with **free tiers**!

---

### 💬 Have Questions?

Anything you don't understand, inquiries, idea suggestions...  
**Feel free to reach out!**

📧 **kr2idiots@gmail.com**

Casual coffee chats welcome too ☕

---

**Next**: [01-quick-start](../01-quick-start/) - Running Locally
