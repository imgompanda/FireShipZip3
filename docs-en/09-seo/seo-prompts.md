# 🤖 SEO Auto-Generation Prompts

> Enter these prompts into AI (Cursor, Claude, etc.) to automatically generate and apply SEO metadata.

---

## 📁 Files to Modify

| File                          | Role                                   |
| ----------------------------- | -------------------------------------- |
| `src/app/[locale]/layout.tsx` | Main metadata (title, description, OG) |
| `messages/ko.json`            | Korean SEO text                        |
| `messages/en.json`            | English SEO text                       |
| `public/og-image.png`         | SNS Sharing Image (1200x630px)         |
| `public/favicon.ico`          | Browser tab icon                       |

---

## 🚀 One-Click AI Instructions

Simply copy and paste the prompt below into your AI:

```
Understand the current project and set up SEO for it.

## Tasks
1. Modify metadata in `src/app/[locale]/layout.tsx`
2. Add SEO-related text to `messages/ko.json` and `messages/en.json`
3. Write all titles and descriptions in both Korean and English
```

---

## 📝 Detailed Prompts

### 1. Generate Metadata Only

```
You are an SEO expert. Analyze the current project and generate SEO metadata for the website based on that information.

## Output Request
1. **title** (Within 60 characters, each in Korean/English)
2. **description** (Within 155 characters, each in Korean/English)
3. **keywords** (10 keywords, comma-separated)
4. **Open Graph title** (Within 60 characters)
5. **Open Graph description** (Within 100 characters)

Provide output in JSON format.
```

### Example Output

```json
{
  "title": {
    "ko": "TaskFlow - 팀 협업의 새로운 기준",
    "en": "TaskFlow - Redefine Team Collaboration"
  },
  "description": {
    "ko": "칸반 보드, 일정 관리, 팀 채팅을 하나로. TaskFlow와 함께 팀 생산성을 높이세요.",
    "en": "Kanban boards, scheduling, team chat in one place. Boost your team's productivity."
  },
  "keywords": [
    "project management",
    "team collaboration",
    "kanban",
    "SaaS",
    "productivity"
  ]
}
```

---

### 2. Apply Directly to layout.tsx

```
Analyze the current project and modify the metadata in `src/app/[locale]/layout.tsx`.

Show the entire modified metadata object.
Include openGraph, twitter, and icons.
```

---

### 3. Generate OG Image (For DALL-E/Midjourney)

```
Create a professional Open Graph image for a SaaS product.

Service name: [Service Name]
Tagline: [One-line Tagline]
Brand colors: [Main Color Hex Code]

Requirements:
- Dimensions: 1200x630 pixels
- Style: Modern, minimal, tech aesthetic
- Include the service name in bold, clean typography
- Add a short tagline below the name
- Use gradient or solid background matching brand colors
- No device mockups or photos of people
- Ensure text is readable and centered

The output should look premium and trustworthy.
```

---

### 4. Page-specific Metadata Generation

```
You are an SEO expert. Analyze the current project and generate separate metadata for each page of the SaaS service.

## Service Info
- Service Name: [Service Name]
- Service Description: [Short Description]

## Page List
1. Home (/)
2. Pricing (/pricing)
3. Blog (/blog)
4. Login (/login)

Generate the following for each page:
- title (Within 60 characters)
- description (Within 155 characters)

Provide both Korean and English versions.
```

---

## ✅ Post-Application Checklist

- [ ] Modified metadata in `layout.tsx`?
- [ ] Saved OG image to `public/og-image.png`?
- [ ] Tested preview by sharing link on KakaoTalk/Slack?
- [ ] Registered site on Google Search Console?

---

## 🔗 Related Documents

- [SEO Setup Guide](./README.md)
- [Legal Document Prompts](../07-ai-customization/legal-prompts.md)
