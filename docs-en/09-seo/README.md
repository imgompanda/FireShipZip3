# 🔍 SEO Setup Guide

Good Search Engine Optimization (SEO) helps users find your service more easily.

---

## 📂 Files in This Folder

| File                                       | Description                                   |
| ------------------------------------------ | --------------------------------------------- |
| **README.md**                              | SEO basics and metadata setup (this document) |
| **[seo-prompts.md](./seo-prompts.md)**     | Prompt collection for AI-assisted SEO setup   |
| **[sitemap-guide.md](./sitemap-guide.md)** | Sitemap & robots.txt setup guide              |
| **[jsonld-guide.md](./jsonld-guide.md)**   | Structured data (JSON-LD) setup guide         |

> 💡 **Tip**: If using AI coding tools, attach `seo-prompts.md` to your AI!

---

## 📁 What Files to Modify?

| File                          | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `src/app/[locale]/layout.tsx` | Main metadata (title, description, OG)       |
| `public/og-image.png`         | Image shown when sharing on SNS (1200x630px) |
| `public/favicon.ico`          | Browser tab icon                             |

---

## 🏷️ What is Metadata?

It's the information that answers when search engines or SNS ask "What is this site about?"

### 1. Basic Metadata

| Item          | Purpose                                     | Example                                   |
| ------------- | ------------------------------------------- | ----------------------------------------- |
| `title`       | Search result title                         | "TaskFlow - Team Collaboration"           |
| `description` | Search result description (up to 155 chars) | "Work together with your team..."         |
| `keywords`    | Keywords for search                         | "SaaS, collaboration, project management" |

### 2. Open Graph (For KakaoTalk, Facebook sharing)

Settings that make link previews look nice when shared.

| Item        | Recommendation  |
| ----------- | --------------- |
| Title       | Under 60 chars  |
| Description | Under 155 chars |
| Image       | **1200x630px**  |

---

## ⚙️ How to Set Up

### Step 1: Modify layout.tsx

Open `src/app/[locale]/layout.tsx` and modify the metadata section:

```tsx
export const metadata: Metadata = {
  title: {
    default: "My Service Name",
    template: "%s | Service Name",
  },
  description: "Introduce your service in one line.",

  openGraph: {
    title: "Service Name",
    description: "Description shown when shared on KakaoTalk/Facebook",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};
```

### Step 2: Replace OG Image

1. Create an image at **1200x630px** size
2. Save as `public/og-image.png`
3. Send link on KakaoTalk or Slack to verify preview looks good!

### Step 3: Replace Favicon

1. Convert your logo to `.ico` format
2. Save as `public/favicon.ico` and you're done!

---

## ✅ Pre-Deployment Checklist

- [ ] Is title under 60 characters?
- [ ] Is description under 155 characters?
- [ ] Is OG image 1200x630px?
- [ ] Did you test link preview by sharing on KakaoTalk?

---

## 🧪 How to Test Previews

| Tool              | Purpose           | Link                                                                                |
| ----------------- | ----------------- | ----------------------------------------------------------------------------------- |
| KakaoTalk         | Real share test   | Just send a link directly                                                           |
| Facebook Debugger | Check OG tags     | [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) |
| Lighthouse        | Overall SEO score | Chrome → F12 → Lighthouse tab                                                       |

---

## 🤖 Let AI Do It

Don't want to write SEO metadata yourself? **Let AI do it!**

👉 **[seo-prompts.md](./seo-prompts.md)** has ready-to-copy prompts.

Attach this file to AI and say:

```
Set up SEO for my service according to this document.

- Service name: [name]
- One-line description: [description]
```

→ AI will automatically modify `layout.tsx`!

---

**Until the day you appear on the first page of search results! 🚀**
