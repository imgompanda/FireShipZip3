import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  getDateBounds,
  getOverviewMetrics,
  getTrafficTrend,
  getTopPages,
  getReferrerStats,
  getDeviceStats,
  getBrowserStats,
} from "@/services/analytics/queries";
import type { DateRange } from "@/types/analytics";

const VALID_RANGES: DateRange[] = ["7d", "30d", "90d", "ytd"];
const VALID_METRICS = [
  "overview",
  "trend",
  "topPages",
  "referrers",
  "devices",
  "browsers",
  "all",
] as const;

type Metric = (typeof VALID_METRICS)[number];

/**
 * Admin-only analytics query API.
 * Returns analytics data based on the requested metric and date range.
 *
 * Query params:
 *   - range: "7d" | "30d" | "90d" | "ytd" (default: "30d")
 *   - metric: "overview" | "trend" | "topPages" | "referrers" | "devices" | "browsers" | "all" (default: "all")
 */
export async function GET(request: NextRequest) {
  try {
    // ---- Auth check ----
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Unauthorized: Not logged in" },
        { status: 401 }
      );
    }

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

    if (!adminEmails.includes(user.email)) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // ---- Parse query params ----
    const { searchParams } = request.nextUrl;
    const rangeParam = searchParams.get("range") || "30d";
    const metricParam = searchParams.get("metric") || "all";

    if (!VALID_RANGES.includes(rangeParam as DateRange)) {
      return NextResponse.json(
        {
          error: `Invalid range: "${rangeParam}". Must be one of: ${VALID_RANGES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!VALID_METRICS.includes(metricParam as Metric)) {
      return NextResponse.json(
        {
          error: `Invalid metric: "${metricParam}". Must be one of: ${VALID_METRICS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const range = rangeParam as DateRange;
    const metric = metricParam as Metric;
    const { from, to } = getDateBounds(range);

    // ---- Fetch requested metric(s) ----
    if (metric === "all") {
      const [overview, trend, topPages, referrers, devices, browsers] =
        await Promise.all([
          getOverviewMetrics(from, to),
          getTrafficTrend(from, to),
          getTopPages(from, to),
          getReferrerStats(from, to),
          getDeviceStats(from, to),
          getBrowserStats(from, to),
        ]);

      return NextResponse.json({
        range,
        from,
        to,
        data: { overview, trend, topPages, referrers, devices, browsers },
      });
    }

    let data: unknown;

    switch (metric) {
      case "overview":
        data = await getOverviewMetrics(from, to);
        break;
      case "trend":
        data = await getTrafficTrend(from, to);
        break;
      case "topPages":
        data = await getTopPages(from, to);
        break;
      case "referrers":
        data = await getReferrerStats(from, to);
        break;
      case "devices":
        data = await getDeviceStats(from, to);
        break;
      case "browsers":
        data = await getBrowserStats(from, to);
        break;
    }

    return NextResponse.json({ range, from, to, data });
  } catch (error) {
    console.error("Analytics query API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
