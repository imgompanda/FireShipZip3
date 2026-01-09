# 07. AI Customization: Customizing with AI

Use AI coding tools like **Claude**, **Cursor**, or **Windsurf** to quickly customize the boilerplate.

---

## 🎨 Changing Branding

Ask AI like this:

### Change Service Name

```
Change "Global SaaS" to "MyAwesomeApp" throughout the entire project.
Include messages/en.json, messages/ko.json, and email templates.
```

### Change Colors

```
Change the primary color to #3B82F6 (blue) in tailwind.config.ts,
and make sure shadcn/ui components use this color too.
```

### Change Logo

```
Reference the public/logo.svg file to:
- Add logo to Header component
- Also update the favicon
```

---

## 💳 Modifying LemonSqueezy Plans

### Change Pricing

```
In messages/en.json and ko.json:
- Change Basic plan to $19/month
- Change Pro plan to $49/month
Also update the landing page Pricing section.
```

### Add New Plan

```
Add an Enterprise plan:
- Price: $99/month
- Features: All Pro features + Unlimited API + Dedicated support
Add translations in messages/ and modify the Pricing component.
```

---

## 📧 Modifying Email Templates

### Change Design

```
Modify src/components/emails/WelcomeEmail.tsx to:
- Add logo image at the top (URL: https://myapp.com/logo.png)
- Change button color to #10B981 (green)
- Add social media icons at the bottom
```

### Add New Template

```
Create TrialEndingEmail.tsx in src/components/emails/:
- Email to send 3 days before trial ends
- Include "Upgrade Now" CTA button
- Support Korean/English multilingual
- Follow WelcomeEmail.tsx style
```

---

## 🗂️ Extending DB Schema

### Add New Columns

```
Modify docs/03-supabase/schema.sql to add these columns
to the subscriptions table:
- trial_ends_at (TIMESTAMPTZ)
- last_payment_at (TIMESTAMPTZ)
Also update src/types/subscription.ts.
```

### Add New Table

```
Add a user_preferences table to docs/03-supabase/schema.sql:
- id (UUID)
- user_id (FK to users)
- theme (TEXT: 'light' | 'dark')
- notifications_enabled (BOOLEAN)
- created_at, updated_at
Include RLS policies.
```

---

## 🌍 Adding Languages

### Add New Language

```
Add Japanese (ja) support:
1. Create messages/ja.json (translate based on en.json)
2. Add 'ja' to src/i18n/routing.ts
3. Add language selector dropdown to landing page
```

---

## 📄 Adding New Pages

### About Page

```
Create src/app/[locale]/about/page.tsx:
- Company introduction section
- Team members section (photo + name + role)
- Contact information
- i18n support
- Follow existing layout styles
```

---

## 💡 Prompt Writing Tips

1. **Be specific**: "primary color to #3B82F6" instead of "change color"
2. **Specify file paths**: "src/components/emails/" instead of "email templates"
3. **Reference existing patterns**: "Follow WelcomeEmail.tsx style"
4. **Mention i18n**: Request translation file updates together

---

**Now build your own SaaS with AI! 🚀**
