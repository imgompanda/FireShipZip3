# 🗺️ Sitemap & robots.txt Guide

Settings to help search engines crawl your site effectively.

---

## 📁 Related Files

| File                 | Role                     | URL            |
| -------------------- | ------------------------ | -------------- |
| `src/app/sitemap.ts` | Auto-generate Sitemap    | `/sitemap.xml` |
| `src/app/robots.ts`  | Configure Crawling Rules | `/robots.txt`  |

---

## 🤔 Why is it Needed?

### Sitemap

A file that tells search engines **"here are the pages on my site."**

- Google indexes your site faster
- New pages are automatically reflected
- Blog posts are automatically included

### robots.txt

A file that tells search engines **"you can crawl here, but not here."**

- Keep dashboard and admin pages out of search results
- Exclude API endpoints from crawling

---

## ⚙️ It's Already Configured!

Sitemap and robots.txt are already set up in this boilerplate.

### Currently Included Pages

```typescript
// src/app/sitemap.ts
const staticPages = [
  { path: "", priority: 1.0 }, // Home
  { path: "/pricing", priority: 0.9 }, // Pricing
  { path: "/blog", priority: 0.8 }, // Blog
  { path: "/terms", priority: 0.3 }, // Terms of Service
  { path: "/privacy", priority: 0.3 }, // Privacy Policy
];
```

### Automatically Added Items

- **Multilingual Pages**: Both `/en/...` and `/ko/...` are included
- **Blog Posts**: All MDX files in `content/blog/`

---

## 🔧 Customizing

### Adding a New Page

Modify the `src/app/sitemap.ts` file:

```typescript
const staticPages = [
  // Existing pages...
  { path: "/about", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/features", priority: 0.8, changeFreq: "weekly" as const },
];
```

### Adding Excluded Paths for Crawling

Modify the `src/app/robots.ts` file:

```typescript
disallow: ["/dashboard/", "/admin/", "/api/", "/my-secret-page/"],
```

---

## 🧪 Verifying

You can check directly on the development server:

- **Sitemap**: http://localhost:3000/sitemap.xml
- **robots.txt**: http://localhost:3000/robots.txt

---

## ✅ Post-Deployment Checklist

- [ ] Is `NEXT_PUBLIC_APP_URL` env variable set to your actual domain?
- [ ] Did you submit the sitemap to Google Search Console?
- [ ] Checked access at `https://your-domain.com/sitemap.xml`?

---

## 🔗 Submitting Sitemap to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Register your site (Verify domain ownership)
3. Left menu → **Sitemaps**
4. Enter `https://your-domain.com/sitemap.xml`
5. Click **Submit**

Google will start indexing your site within a few days!

---

**Now search engines can find your site easily! 🔍**
