# Admin Console

The Admin Console is a page where you can monitor your service's growth at a glance and manage customers. It's connected to the **Supabase** database, so you can also view **Lemon Squeezy** payment history in real-time.

---

## 🔐 How to Set Up Admin Access

The admin page is restricted to specific users for security.  
**Authorization check logic is already implemented in the code.**

### Step 1: Set Environment Variable

Add the `ADMIN_EMAILS` variable to your `.env.local` file and enter the email addresses you want to grant admin access to, separated by commas (`,`).

```bash
# .env.local
ADMIN_EMAILS=admin@example.com,your-email@gmail.com
```

### Step 2: Add to Production Environment

If you've deployed to Vercel or similar, make sure to add `ADMIN_EMAILS` to your deployment site's Environment Variables settings!

---

## 📊 Data Integration Status

The admin overview page currently reflects real data as follows:

- **MRR**: Auto-calculated based on active subscriber count
- **Active Subscribers**: Real-time aggregation from `subscriptions` table in DB
- **Sales Today**: Number of new subscriptions in the last 24 hours
- **Recent Subscriptions**: Latest subscription list (including User ID)

---

## 🚀 What Features Are Available?

1.  **Dashboard Overview (`/admin/overview`)**

    - **MRR (Monthly Recurring Revenue)**: Shows expected revenue for this month based on active subscriber count.
    - **Active Subscribers**: See how many customers are currently subscribed to your service.
    - **Recent Sales**: Check real-time subscription activity from customers who just signed up.

2.  **Data Management Commons (Search, Filter, Pagination)**

    - **Powerful Search**: Instantly find the data you need by customer email, product name, ticket title, etc.
    - **Smart Filters**: Sort and group lists by subscription status or ticket status.
    - **Pagination**: Handle large amounts of data without slowdown, divided into 10-item pages.

3.  **Customer Management (`/admin/customers`)**

    - View all customer information using your service in one place.
    - Check subscription status (`active`, `cancelled`, etc.), current plan (Basic/Pro), next billing date, and more.

4.  **Payment History (`/admin/sales`)**

    - View and manage all payment history (one-time and subscriptions) chronologically.

5.  **Other Convenience Features**
    - **Theme Toggle**: Switch between dark/light mode using the 🌓 button on the right side of the admin navigation bar.

---

## 📊 How Is Data Loaded?

- **MRR Calculation**: Currently calculated simply as `Active Subscribers` × `$19` (Basic plan price). To reflect accurate per-plan pricing, just modify the `getAdminStats()` function in `src/app/[locale]/admin/overview/page.tsx`.
- **Subscriber Count**: Counts only users with `active` subscription status from the `subscriptions` table in the database.
