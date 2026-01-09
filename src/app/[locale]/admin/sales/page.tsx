import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { AdminPagination } from "@/components/admin/AdminPagination";

interface AdminPurchase {
  id: string;
  created_at: string;
  product_name: string;
  variant_name?: string;
  amount: number;
  currency: string;
  status: string;
  users: {
    email: string;
  } | null;
}

export default async function AdminSalesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const t = await getTranslations("Admin.sales");

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  let purchases: AdminPurchase[] = [];
  let count: number | null = 0;

  if (isDemoMode) {
    purchases = Array.from({ length: 5 }).map((_, i) => ({
      id: `demo-sale-${i}`,
      created_at: new Date(Date.now() - 86400000 * i).toISOString(),
      product_name: "SaaS Starter Kit",
      variant_name: "Standard License",
      amount: 4900,
      currency: "USD",
      status: "paid",
      users: {
        email: `demo${i + 1}@example.com`,
      },
    }));
    count = 5;
  } else {
    const supabase = await createClient();

    // Fetch all purchases with user email and count
    let query = supabase
      .from("purchases")
      .select("*, users(email)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`product_name.ilike.%${q}%,users.email.ilike.%${q}%`);
    }

    const { data, count: dbCount } = await query.range(from, to);
    purchases = (data as unknown as AdminPurchase[]) || [];
    count = dbCount;
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            {t("description")}
          </p>
        </div>
        <AdminSearch placeholder="Search product or email..." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">{t("colDate")}</th>
                  <th className="px-4 py-3">{t("colCustomer")}</th>
                  <th className="px-4 py-3">{t("colProduct")}</th>
                  <th className="px-4 py-3">{t("colAmount")}</th>
                  <th className="px-4 py-3 rounded-r-lg">{t("colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {purchases && purchases.length > 0 ? (
                  (purchases as unknown as AdminPurchase[]).map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-800"
                    >
                      <td className="px-4 py-3">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {purchase.users?.email || "Unknown"}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {purchase.product_name}
                        {purchase.variant_name && (
                          <span className="block text-xs text-zinc-500">
                            {purchase.variant_name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {(purchase.amount / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: purchase.currency || "USD",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {purchase.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      No sales found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <AdminPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
