import { createAdminClient } from "@/utils/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: "pending" | "processed" | "failed";
  error_message: string | null;
  created_at: string;
}

async function getWebhookEvents(): Promise<WebhookEvent[]> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  if (isDemoMode) {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `demo-webhook-${i}`,
      event_id: `evt_demo_${i}_${Date.now()}`,
      event_type: i % 2 === 0 ? "subscription_created" : "subscription_updated",
      payload: {},
      status: i === 3 ? "failed" : "processed",
      error_message: i === 3 ? "Connection timeout" : null,
      created_at: new Date(Date.now() - 3600000 * i).toISOString(),
    }));
  }

  // Admin Client 사용 (RLS 우회)
  const supabase = createAdminClient();

  const { data: events } = await supabase
    .from("lemon_webhook_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return events || [];
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "processed":
      return "default";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
}

function getEventBadgeColor(eventType: string): string {
  if (eventType.includes("created")) return "bg-green-100 text-green-800";
  if (eventType.includes("updated")) return "bg-blue-100 text-blue-800";
  if (eventType.includes("cancelled") || eventType.includes("failed"))
    return "bg-red-100 text-red-800";
  if (eventType.includes("success")) return "bg-emerald-100 text-emerald-800";
  return "bg-base-200 text-base-content";
}

export default async function AdminWebhooksPage() {
  const events = await getWebhookEvents();
  const t = await getTranslations("Admin.webhooks");

  const stats = {
    total: events.length,
    processed: events.filter((e) => e.status === "processed").length,
    failed: events.filter((e) => e.status === "failed").length,
    pending: events.filter((e) => e.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("total")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("processed")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.processed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("failed")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.failed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("recentEvents")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("eventType")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("eventId")}</TableHead>
                <TableHead>{t("time")}</TableHead>
                <TableHead>{t("error")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEventBadgeColor(
                        event.event_type
                      )}`}
                    >
                      {event.event_type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {event.event_id.substring(0, 20)}...
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(event.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-red-600">
                    {event.error_message || "-"}
                  </TableCell>
                </TableRow>
              ))}
              {events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {t("noEvents")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
