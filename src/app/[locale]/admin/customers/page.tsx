import { createAdminClient } from "@/utils/supabase/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { AdminFilter } from "@/components/admin/AdminFilter";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { getPlanByVariantId } from "@/lib/lemon/plans";
import { Link } from "@/i18n/routing";

interface Customer {
  id: string;
  status: string;
  plan_id: string | null;
  plan_name: string | null;
  lemon_customer_id: string | null;
  current_period_end: string | null;
  created_at: string | null;
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

async function getCustomers(filters?: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: Customer[]; totalPages: number }> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  if (isDemoMode) {
    return {
      data: Array.from({ length: 5 }).map((_, i) => ({
        id: `demo-sub-${i}`,
        status: "active",
        plan_id: "variant_123",
        plan_name: "Pro Plan",
        lemon_customer_id: "lc_demo",
        current_period_end: new Date(Date.now() + 86400000 * 30).toISOString(),
        created_at: new Date(Date.now() - 86400000 * i).toISOString(),
        user: {
          id: `demo-user-${i}`,
          email: `demo${i + 1}@example.com`,
          full_name: `Demo User ${i + 1}`,
          avatar_url: null,
        },
      })),
      totalPages: 1,
    };
  }

  // Admin Client 사용 (RLS 우회)
  const supabase = createAdminClient();
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("subscriptions")
    .select(
      "id, status, plan_id, plan_name, lemon_customer_id, current_period_end, created_at, user:users(id, email, full_name, avatar_url)",
      {
        count: "exact",
      }
    )
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.q) {
    query = query.filter("user.email", "ilike", `%${filters.q}%`);
  }

  const { data: customers, count } = await query.range(from, to);

  return {
    data: (customers as unknown as Customer[]) || [],
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// plan_id로 가격 가져오기
function getPriceDisplay(planId: string | null): string {
  if (!planId) return "-";
  const plan = getPlanByVariantId(planId);
  return plan.price.replace("/month", "");
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const { data: customers, totalPages } = await getCustomers({
    q,
    status,
    page: currentPage,
  });
  const t = await getTranslations("Admin.customers");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <AdminSearch placeholder="Search customer email..." />
        <AdminFilter
          name="status"
          placeholder="All Statuses"
          options={[
            { label: "Active", value: "active" },
            { label: "Trialing", value: "trialing" },
            { label: "Past Due", value: "past_due" },
            { label: "Canceled", value: "canceled" },
            { label: "Unpaid", value: "unpaid" },
          ]}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("customer")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("plan")}</TableHead>
              <TableHead>{t("startDate")}</TableHead>
              <TableHead>{t("renewsOn")}</TableHead>
              <TableHead className="text-right">{t("amount")}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.user?.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {customer.user?.full_name || customer.user?.id?.slice(0, 8)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      customer.status === "active" ? "default" : "secondary"
                    }
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.plan_name || "-"}</TableCell>
                <TableCell>
                  {customer.created_at
                    ? new Date(customer.created_at).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {customer.current_period_end
                    ? new Date(customer.current_period_end).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {getPriceDisplay(customer.plan_id)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/customers/${customer.id}`}>
                          {t("viewDetails")}
                        </Link>
                      </DropdownMenuItem>
                      {customer.lemon_customer_id && (
                        <DropdownMenuItem asChild>
                          <a
                            href={`https://app.lemonsqueezy.com/customers/${customer.lemon_customer_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            {t("viewOnLemon")}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        {t("cancelSubscription")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {!customers.length && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("noCustomers")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AdminPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
