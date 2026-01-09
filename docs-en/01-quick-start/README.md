# 01. Quick Start: Run Locally in 5 Minutes

Follow this guide to **run the project locally in 5 minutes**.

---

## Prerequisites

You need the following installed:

- **Node.js 18+** → [nodejs.org](https://nodejs.org)
- **pnpm** (recommended) or npm → `npm install -g pnpm`

---

## Step 1: Open Project Folder

Open the downloaded folder in your terminal:

```bash
cd global-saas-starter-kit
```

---

## Step 2: Install Dependencies

```bash
pnpm install
# or
npm install
```

---

## Step 3: Create Environment File

```bash
cp .env.local.example .env.local
```

Verify the file was created! If `.env.local` exists, you're good 👍

### ⚠️ Important: Set ADMIN_EMAILS

Open `.env.local` and change **ADMIN_EMAILS** to your email:

```bash
# User emails with admin privileges (comma separated)
ADMIN_EMAILS=your-google-email@gmail.com
```

> 💡 **Tip**: Enter the email you'll use for Google OAuth login!
>
> - Your test Google account or personal Google account
> - Logging in with this email grants access to the **admin dashboard**

> [!NOTE]
> Other values (Supabase, LemonSqueezy, etc.) will be filled in **one by one** in the following docs.

---

## Step 4: Start Development Server

Let's start the server. (Some features may not work yet without environment variables)

```bash
pnpm dev
# or
npm run dev
```

---

## Step 5: Check in Browser

Visit [http://localhost:3000](http://localhost:3000)!

🎉 **If you see the landing page, success!**

> ⚠️ Features like login won't work yet. We'll set that up in the next steps.

---

## Next Steps

Now let's integrate the services.  
**Follow in order!**

| Order | Guide                              | Description                 | Notes                               |
| ----- | ---------------------------------- | --------------------------- | ----------------------------------- |
| 1     | [02-deployment](../02-deployment/) | **Deploy to Vercel first!** | Easier to configure once URL is set |
| 2     | [03-supabase](../03-supabase/)     | Auth + DB Integration       | Set localhost + deploy URL together |
| 3     | [04-lemon](../04-lemon/)           | Payment System Integration  | Set webhook with deploy URL         |
| 4     | [05-resend](../05-resend/)         | Email Sending Setup         | Just need API Key                   |

💡 **Tip**: Login/signup works after completing just 03-supabase!

---

## 💬 Troubleshooting

### ❌ Page is white with errors (Root Layout error)

Starting from Next.js 16 (Turbopack), the Root Layout (`src/app/layout.tsx`) must include `<html>` and `<body>` tags.
This is already reflected in the latest boilerplate, but if you modify it manually, make sure these tags aren't missing.

### ❌ `pnpm` command not found

If `pnpm` isn't installed, you can use `npm install` instead. However, for consistent package management, we recommend installing via `corepack enable` or `npm install -g pnpm`.

### `Error: NEXT_PUBLIC_SUPABASE_URL is not defined`

→ Check if `.env.local` file exists.  
→ If you haven't filled in the values yet, go to [03-supabase](../03-supabase/)!

### Port 3000 is already in use

→ Run on a different port: `pnpm dev -p 3001`
