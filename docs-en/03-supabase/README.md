# 03. Supabase Setup

Connect Supabase to use **authentication** and **database**.

---

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Click the **"New Project"** button.
3. Enter the following:
   - **Name**: Your desired project name
   - **Database Password**: Strong password (make sure to save it!)
   - **Region**: `Northeast Asia (Seoul)` recommended
4. Click **"Create new project"** and wait 1-2 minutes.

---

## Step 2: Copy API Keys

Once your project is created:

### Copy Project URL

1. Click **⚙️ Project Settings** → **General** in the left menu
2. Copy the **Project ID** (e.g., `yefkaazcfppacgwuaqp`)
3. URL format: `https://{Project ID}.supabase.co`

### Copy API Keys

1. Click **⚙️ Project Settings** → **API Keys**
2. Select the **"Legacy anon, service_role API keys"** tab
3. Copy the **anon public** key
4. Also copy the **service_role secret** key (for webhooks - bypasses RLS)

> ⚠️ **Warning**: Never expose the `service_role` key to the client!

### Enter in .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-ProjectID-here.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service_role-key
```

---

## Step 3: Create Database Tables

1. Supabase Dashboard → Click **🗂️ SQL Editor**
2. Click **"New query"**
3. Copy and paste the contents of `schema.sql` from this folder
4. Click **"Run"**

✅ On success, 3 tables are created:

- `users` - User profiles
- `subscriptions` - Subscription info
- `lemon_webhook_events` - LemonSqueezy event logs

---

## Step 4: Set Up Google OAuth

1. Supabase Dashboard → **🔐 Authentication** → **Providers**
2. Click **Google** → Toggle **Enable** on
3. Create a project in [Google Cloud Console](https://console.cloud.google.com/), then create OAuth client:
   - Configure **OAuth consent screen** (select External)
   - **Credentials** -> Create **OAuth 2.0 Client ID**
   - **Authorized redirect URIs**: Copy/paste Callback URL from Supabase Dashboard
4. Paste the generated Client ID and Client Secret into Supabase
5. Click **Save**

---

## Step 5: Magic Link Email Setup

URL configuration is needed for magic link login with just an email address.

1. Supabase Dashboard → **🔐 Authentication** → **URL Configuration**
2. Set **Site URL**:
   - Local development: `http://localhost:3000`
   - After deployment: `https://your-project.vercel.app` (or custom domain)
3. Add these paths to **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://your-project.vercel.app/**` (after deployment)
   - `https://your-custom-domain.com/**` (if using custom domain)

> **Tip**: You can modify email subject and content in Email Customization.
> (Authentication → Notifications → Email → Magic Link)

---

## 💡 Extending/Modifying Schema with AI

Using AI coding tools like **Claude Code**, **Cursor**, or **Windsurf** makes schema extension easy.

### Example: Adding a New Column

Try asking the AI:

```
Modify `docs/supabase-schema.sql` to add a `trial_ends_at` (TIMESTAMPTZ) column
to the `subscriptions` table.
Keep RLS policies intact and ensure compatibility with the existing table.
```

### Example: Adding a New Table

```
Add a `user_activity_logs` table to `docs/supabase-schema.sql`.
Columns: id, user_id, action, metadata(jsonb), created_at.
Include RLS policies so users can only see their own activity.
```

💡 **Tip**: After schema changes, also update TypeScript types in the `src/types/` folder.

---

## 🧪 Testing

1. Run `npm run dev`
2. Go to `http://localhost:3000/en/login`
3. Click **Continue with Google**
4. If you're redirected to Dashboard, success! 🎉

---

## 💬 Troubleshooting

### "Invalid login credentials" Error

→ Check if `.env.local` keys are correct.

### "redirect_uri_mismatch" Error During Google Login

→ Verify that **Authorized redirect URIs** in Google Cloud Console are correct.

---

**Next**: [04-lemon](../04-lemon/) - LemonSqueezy Payment Setup
