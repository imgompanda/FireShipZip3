import { getTickets } from "@/services/support/admin-actions";
import { TicketStatusSelect } from "@/components/features/support/TicketStatusSelect";
import { AdminTicketDetail } from "@/components/features/support/AdminTicketDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { AdminFilter } from "@/components/admin/AdminFilter";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { getTranslations } from "next-intl/server";

interface Ticket {
  id: string;
  created_at: string;
  email: string;
  subject: string;
  message: string; // Add message field
  category?: string;
  status: string;
  reply?: string;
  replied_at?: string;
}

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const { q, status, category, page } = await searchParams;
  const currentPage = parseInt(page || "1");

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  let tickets: Ticket[] = [];
  let totalPages = 1;

  if (isDemoMode) {
    tickets = Array.from({ length: 5 }).map((_, i) => ({
      id: `demo-ticket-${i}`,
      created_at: new Date(Date.now() - 86400000 * i).toISOString(),
      email: `demo${i + 1}@example.com`,
      subject: `Demo Issue #${i + 1}: How to use this kit?`,
      message: "This is a demo ticket message. Please ignore.",
      category: i % 2 === 0 ? "technical" : "billing",
      status: i === 0 ? "open" : "resolved",
    }));
    totalPages = 1;
  } else {
    const result = (await getTickets({
      q,
      status,
      category,
      page: currentPage,
    })) as { data: Ticket[]; count: number; totalPages: number };
    tickets = result.data;
    totalPages = result.totalPages;
  }

  const t = await getTranslations("Admin.tickets");
  const st = await getTranslations("Subscription.status");
  const ct = await getTranslations("Support.category");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-base-content/60">{t("description")}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <AdminSearch placeholder={t("searchPlaceholder")} />
        <div className="flex gap-2">
          <AdminFilter
            name="status"
            placeholder={t("allStatuses")}
            options={[
              { label: st("active"), value: "open" },
              { label: st("trialing"), value: "in_progress" },
              { label: "Resolved", value: "resolved" },
              { label: st("canceled"), value: "closed" },
            ]}
          />
          <AdminFilter
            name="category"
            placeholder={t("allCategories")}
            options={[
              { label: ct("billing"), value: "billing" },
              { label: ct("account"), value: "account" },
              { label: ct("technical"), value: "technical" },
              { label: ct("general"), value: "general" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("colDate")}</TableHead>
              <TableHead>{t("colEmail")}</TableHead>
              <TableHead>{t("colSubject")}</TableHead>
              <TableHead>{t("colCategory")}</TableHead>
              <TableHead>{t("colStatus")}</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  {t("noTickets")}
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    {format(new Date(ticket.created_at), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell>{ticket.email}</TableCell>
                  <TableCell
                    className="max-w-[300px] truncate"
                    title={ticket.subject}
                  >
                    {ticket.subject}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-info/10 text-info`}
                    >
                      {ticket.category
                        ? ct(
                            ticket.category as
                              | "general"
                              | "billing"
                              | "account"
                              | "technical"
                          )
                        : ct("general")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TicketStatusSelect
                      ticketId={ticket.id}
                      currentStatus={ticket.status}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <AdminTicketDetail ticket={ticket} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AdminPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
