# Customer Support System

A built-in ticket system where users can submit inquiries and admins can efficiently manage them.

## 🚀 Key Features

### 👤 User Side

- **Easy Inquiry Submission**: Submit inquiries on the `/support` page by entering email, subject, category, and content.
- **Auto Email Fill**: For logged-in users, email address is automatically filled for convenience.
- **Category Selection**: Choose inquiry type: Billing, Account, Technical Support, Other.
- **Real-time Feedback**: Toast message instantly notifies successful submission.

### 🛡️ Admin Side

- **Unified List View**: View all inquiries at a glance at `/admin/tickets`.
- **Search & Filtering (New!)**:
  - **Search**: Quickly find specific tickets by user email or subject keyword.
  - **Filter**: Group by status (`Open`, `In Progress`, `Resolved`, `Closed`) or category.
- **Pagination (New!)**: Manage many tickets comfortably, 10 per page.
- **Status Management**: Update ticket status in real-time via dropdown menu.
- **Multilingual Support**: Fully supports both Korean and English.

## 🛠️ Implementation Details

- **Database**: Supabase `support_tickets` table (with RLS policies)
- **Form Handling**: React Hook Form + Zod (validation)
- **UI Components**: Shadcn UI (Table, Select, Badge, Toast)
- **Server Actions**: Secure data handling via Next.js Server Actions

## 📖 How to Use

1.  **User Inquiry Submission**:
    - Go to `/support` page.
    - Fill out the form and click "Submit" button.
2.  **Inquiry Response & Management**:
    - Go to `/admin/tickets` page. (Admin access required)
    - Use the search bar and filters at the top to review tickets.
    - Click the "Status" column button to change status - saves in real-time.

---

## 🌎 Internationalization (i18n)

- **Korean**: See `Support`, `Admin.tickets` sections in `messages/ko.json`
- **English**: See `Support`, `Admin.tickets` sections in `messages/en.json`
