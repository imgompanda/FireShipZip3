# UI Components Guide

FireShip includes **27 base UI components** and **various feature-specific components**. All are built on **shadcn/ui** and easily customizable.

---

## Base UI Components (`/components/ui/`)

| Component           | File                  | Description                        |
| ------------------- | --------------------- | ---------------------------------- |
| **Accordion**       | `accordion.tsx`       | Collapsible accordion UI           |
| **Alert Dialog**    | `alert-dialog.tsx`    | Confirm/cancel popup dialog        |
| **Alert**           | `alert.tsx`           | Alert message box                  |
| **Avatar**          | `avatar.tsx`          | Profile avatar image               |
| **Badge**           | `badge.tsx`           | Tag/badge (status indicator)       |
| **Button**          | `button.tsx`          | Button (multiple variants)         |
| **Card**            | `card.tsx`            | Card layout                        |
| **Checkbox**        | `checkbox.tsx`        | Checkbox                           |
| **Cookie Consent**  | `cookie-consent.tsx`  | Cookie consent banner              |
| **Dialog**          | `dialog.tsx`          | Modal dialog                       |
| **Dropdown Menu**   | `dropdown-menu.tsx`   | Dropdown menu                      |
| **Feedback Widget** | `feedback-widget.tsx` | Feedback collection widget         |
| **Form**            | `form.tsx`            | Form (react-hook-form integration) |
| **Input**           | `input.tsx`           | Text input field                   |
| **Label**           | `label.tsx`           | Form label                         |
| **Popover**         | `popover.tsx`         | Popover                            |
| **Scroll Area**     | `scroll-area.tsx`     | Custom scroll area                 |
| **Select**          | `select.tsx`          | Select dropdown                    |
| **Separator**       | `separator.tsx`       | Divider line                       |
| **Sheet**           | `sheet.tsx`           | Side sheet (slide panel)           |
| **Sidebar**         | `sidebar.tsx`         | Sidebar navigation                 |
| **Skeleton**        | `skeleton.tsx`        | Loading skeleton                   |
| **Sonner**          | `sonner.tsx`          | Toast notifications                |
| **Table**           | `table.tsx`           | Table                              |
| **Tabs**            | `tabs.tsx`            | Tab navigation                     |
| **Textarea**        | `textarea.tsx`        | Multi-line text input              |
| **Tooltip**         | `tooltip.tsx`         | Tooltip                            |

---

## Shared Components (`/components/shared/`)

| Component         | File                | Description               |
| ----------------- | ------------------- | ------------------------- |
| **Header**        | `Header.tsx`        | Global header/navigation  |
| **Footer**        | `Footer.tsx`        | Global footer             |
| **ClientWidgets** | `ClientWidgets.tsx` | Client widget loader      |
| **JsonLd**        | `JsonLd.tsx`        | SEO structured data       |
| **ThemeProvider** | `ThemeProvider.tsx` | Dark/light theme provider |
| **ThemeToggle**   | `ThemeToggle.tsx`   | Theme toggle button       |

---

## Feature Components

### 💳 Subscription Management (`/components/features/subscription/`)

| Component          | File                           | Description                               |
| ------------------ | ------------------------------ | ----------------------------------------- |
| **Cancel Button**  | `CancelSubscriptionButton.tsx` | Cancel subscription (with confirm dialog) |
| **Billing Button** | `ManageBillingButton.tsx`      | Manage billing (LemonSqueezy integration) |
| **Failed Banner**  | `PaymentFailedBanner.tsx`      | Payment failure notification banner       |

### 🎫 Customer Support (`/components/features/support/`)

| Component         | File                     | Description              |
| ----------------- | ------------------------ | ------------------------ |
| **Ticket Form**   | `SupportTicketForm.tsx`  | Support ticket form      |
| **Ticket List**   | `UserTicketList.tsx`     | User ticket list         |
| **Admin Detail**  | `AdminTicketDetail.tsx`  | Admin ticket detail view |
| **Status Select** | `TicketStatusSelect.tsx` | Ticket status selector   |

---

## Admin Components (`/components/admin/`)

| Component            | File                  | Description                           |
| -------------------- | --------------------- | ------------------------------------- |
| **Admin Chart**      | `AdminChart.tsx`      | Revenue/subscription chart (Recharts) |
| **Admin Filter**     | `AdminFilter.tsx`     | Data filter UI                        |
| **Admin Pagination** | `AdminPagination.tsx` | Pagination                            |
| **Admin Search**     | `AdminSearch.tsx`     | Search UI                             |

---

## Email Templates (`/components/emails/`)

| Component          | File                     | Description                 |
| ------------------ | ------------------------ | --------------------------- |
| **Welcome Email**  | `WelcomeEmail.tsx`       | Welcome email (on signup)   |
| **Payment Failed** | `PaymentFailedEmail.tsx` | Payment failure alert email |

---

## Component Usage Examples

### Using Button

```tsx
import { Button } from "@/components/ui/button";

// Basic button
<Button>Click</Button>

// With variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Size variations
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>
```

### Using Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content goes here.</CardContent>
</Card>;
```

### Using Dialog (Modal)

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    <p>Modal content here.</p>
  </DialogContent>
</Dialog>;
```

---

## Adding New Components

You can install additional components from the shadcn/ui library:

```bash
npx shadcn-ui@latest add [component-name]

# Examples
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch
```

> 💡 **Tip**: Check all available components at [shadcn/ui official docs](https://ui.shadcn.com/docs/components).

---

## Next Steps

- [UI Customization Guide](./customization.md) - How to change colors, fonts, and themes
