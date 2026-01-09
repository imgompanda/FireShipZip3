# UI Customization Guide

This project is styled with **Tailwind CSS** and **Shadcn/UI**.
Here's how to easily change colors, fonts, and component styles.

## 1. Changing Color Theme

Modify CSS variables in `src/app/globals.css` to change the overall theme colors.

```css
@layer base {
  :root {
    /* Main Color (Primary) */
    --primary: 240 5.9% 10%; /* HSL values */
    --primary-foreground: 0 0% 98%;

    /* Accent Color */
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
  }

  /* Dark Mode Colors */
  .dark {
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
  }
}
```

> **Tip**: Use sites like [UI Colors](https://uicolors.app) to copy HSL values easily.

## 2. Changing Fonts

Change Google Fonts in `src/app/[locale]/layout.tsx`.

```tsx
import { Inter } from "next/font/google"; // 1. Import desired font

const inter = Inter({ subsets: ["latin"] }); // 2. Configure font

// 3. Apply to body class
<body className={inter.className}>
```

## 3. Customizing UI Components

### Cookie Consent Banner

- File: `src/components/ui/cookie-consent.tsx`
- **Style changes**: Modify Tailwind classes on `div` tags (e.g., `bg-white` -> `bg-blue-50`).
- **Position changes**: Change `bottom-0` to `top-0` for a top banner.

### Feedback Widget

- File: `src/components/ui/feedback-widget.tsx`
- **Change icon**: Replace `MessageSquareIcon` with another icon.
- **Change color**: Modify `Button` `variant` or `className`.

## 4. Adding New Components

To add components from the Shadcn/UI library, refer to official docs or use CLI:

```bash
npx shadcn-ui@latest add [component-name]
# e.g.: npx shadcn-ui@latest add dialog
```
