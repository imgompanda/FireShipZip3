import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTranslations } from "next-intl/server";
import { AdminFilter } from "@/components/admin/AdminFilter";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminPaymentsChart } from "./AdminPaymentsChart";

type PaymentProvider = "lemon" | "paddle" | "toss";

interface PaymentRecord {
  id: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded";
  customer_email: string;
  plan: string;
  created_at: string;
}

function generateDemoPayments(): PaymentRecord[] {
  const providers: PaymentProvider[] = ["lemon", "paddle", "toss"];
  const statuses: PaymentRecord["status"][] = [
    "completed",
    "completed",
    "completed",
    "pending",
    "failed",
  ];
  const plans = ["Basic", "Pro"];

  return Array.from({ length: 15 }).map((_, i) => ({
    id: `demo-payment-${i}`,
    provider: providers[i % 3],
    amount: plans[i % 2] === "Basic" ? 900 : 2900,
    currency: providers[i % 3] === "toss" ? "KRW" : "USD",
    status: statuses[i % 5],
    customer_email: `user${i + 1}@example.com`,
    plan: plans[i % 2],
    created_at: new Date(Date.now() - 86400000 * i).toISOString(),
  }));
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
    case "refunded":
      return "outline";
    default:
      return "secondary";
  }
}

function getProviderLabel(provider: PaymentProvider): string {
  switch (provider) {
    case "lemon":
      return "LemonSqueezy";
    case "paddle":
      return "Paddle";
    case "toss":
      return "TossPayments";
  }
}

function getProviderBadgeClass(provider: PaymentProvider): string {
  switch (provider) {
    case "lemon":
      return "bg-warning/10 text-warning";
    case "paddle":
      return "bg-info/10 text-info";
    case "toss":
      return "bg-primary/10 text-primary";
  }
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; page?: string }>;
}) {
  const { provider, page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const pageSize = 10;

  const t = await getTranslations("Admin.payments");

  // Demo data (실제 구현 시 Supabase에서 조회)
  let allPayments = generateDemoPayments();

  // Filter by provider
  if (provider && provider !== "all") {
    allPayments = allPayments.filter((p) => p.provider === provider);
  }

  const totalPages = Math.ceil(allPayments.length / pageSize);
  const from = (currentPage - 1) * pageSize;
  const payments = allPayments.slice(from, from + pageSize);

  // Provider별 통계
  const allDemo = generateDemoPayments();
  const stats = {
    lemon: {
      count: allDemo.filter((p) => p.provider === "lemon").length,
      revenue: allDemo
        .filter((p) => p.provider === "lemon" && p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0),
    },
    paddle: {
      count: allDemo.filter((p) => p.provider === "paddle").length,
      revenue: allDemo
        .filter((p) => p.provider === "paddle" && p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0),
    },
    toss: {
      count: allDemo.filter((p) => p.provider === "toss").length,
      revenue: allDemo
        .filter((p) => p.provider === "toss" && p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0),
    },
  };

  const providerFilterOptions = [
    { label: "LemonSqueezy", value: "lemon" },
    { label: "Paddle", value: "paddle" },
    { label: "TossPayments", value: "toss" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Provider Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span>🍋</span> LemonSqueezy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.lemon.revenue / 100).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("transactionCount", { count: stats.lemon.count })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span>🏓</span> Paddle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.paddle.revenue / 100).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("transactionCount", { count: stats.paddle.count })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span>💙</span> TossPayments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.toss.revenue.toLocaleString("ko-KR")}
              <span className="text-sm font-normal ml-1">
                {stats.toss.revenue > 0 ? "KRW" : ""}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("transactionCount", { count: stats.toss.count })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <AdminPaymentsChart />

      {/* Filter & Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>{t("recentPayments")}</CardTitle>
            <CardDescription>{t("recentPaymentsDescription")}</CardDescription>
          </div>
          <AdminFilter
            name="provider"
            placeholder={t("allProviders")}
            options={providerFilterOptions}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("colProvider")}</TableHead>
                <TableHead>{t("colCustomer")}</TableHead>
                <TableHead>{t("colPlan")}</TableHead>
                <TableHead>{t("colAmount")}</TableHead>
                <TableHead>{t("colStatus")}</TableHead>
                <TableHead>{t("colDate")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getProviderBadgeClass(payment.provider)}`}
                    >
                      {getProviderLabel(payment.provider)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {payment.customer_email}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {payment.plan}
                  </TableCell>
                  <TableCell className="text-sm">
                    {payment.currency === "KRW"
                      ? `${payment.amount.toLocaleString("ko-KR")} KRW`
                      : `$${(payment.amount / 100).toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("noPayments")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AdminPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
