# 🏷️ JSON-LD Structured Data Guide

Settings to make your site stand out in search results with **Rich Snippets**.

---

## 🤔 What is JSON-LD?

Structured data that tells search engines **"this site is this type of thing."**

### Before Application

```
My SaaS - Team Collaboration Tool
https://mysaas.com
Work together with your team...
```

### After Application (Rich Snippet)

```
⭐⭐⭐⭐⭐ 4.8 (200 reviews)
🏢 My SaaS - Team Collaboration Tool
https://mysaas.com
Free trial available | Work together with your team...
```

---

## 📁 Related Files

| File                               | Role                                   |
| ---------------------------------- | -------------------------------------- |
| `src/app/[locale]/layout.tsx`      | Global JSON-LD (WebSite, Organization) |
| `src/components/shared/JsonLd.tsx` | Reusable JSON-LD components            |

---

## ⚙️ It's Already Configured!

The basic JSON-LD is already set up in this boilerplate:

### Included Schemas

- **WebSite**: Basic site information
- **Organization**: Company/Brand information

---

## 🔧 Customizing

### Editing in layout.tsx

Modify the `<head>` section of `src/app/[locale]/layout.tsx`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "My Service Name", // Change this
      url: "https://my-domain.com", // Change this
      logo: "https://my-domain.com/logo.png", // Change this
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@my-domain.com", // Change this
        contactType: "customer service",
      },
    }),
  }}
/>
```

### Adding Article Schema to Blog Posts

```tsx
import { ArticleJsonLd } from "@/components/shared/JsonLd";

export default function BlogPost({ post }) {
  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        publishedTime={post.date}
        author="FreAiner"
        url={`https://my-domain.com/blog/${post.slug}`}
      />
      {/* Post Content */}
    </>
  );
}
```

---

## 📋 Common Schema Types

| Type                  | Purpose                   |
| --------------------- | ------------------------- |
| `WebSite`             | Basic site information    |
| `Organization`        | Company/Brand information |
| `SoftwareApplication` | SaaS app information      |
| `Article`             | Blog posts                |
| `FAQPage`             | FAQ pages                 |
| `Product`             | Products (Pricing plans)  |

---

## 🧪 Testing

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your site URL
3. Verify if structured data is recognized correctly

---

## 💡 Let AI Do It

Ask AI if you need new schemas:

```
Add SoftwareApplication schema to src/app/[locale]/layout.tsx.
App name is "TaskFlow", category is "BusinessApplication",
and set pricing to "Free trial available".
```

---

**Now your site will be more visible in search results! ⭐**
