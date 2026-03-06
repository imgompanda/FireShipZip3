import { createAdminClient } from "@/utils/supabase/admin";
import type {
  OverviewMetrics,
  TrendData,
  TopPagesData,
  ReferrerData,
  DeviceData,
  BrowserData,
  DateRange,
} from "@/types/analytics";

/**
 * Calculate date range boundaries from a DateRange preset.
 */
export function getDateBounds(range: DateRange): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString();

  let from: Date;
  switch (range) {
    case "7d":
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "ytd":
      from = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return { from: from.toISOString(), to };
}

/**
 * Get the previous period boundaries for comparison.
 */
function getPreviousPeriodBounds(from: string, to: string) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const duration = toDate.getTime() - fromDate.getTime();

  return {
    from: new Date(fromDate.getTime() - duration).toISOString(),
    to: from,
  };
}

/**
 * Get overview metrics: page views, unique visitors, sessions, bounce rate.
 */
export async function getOverviewMetrics(
  from: string,
  to: string
): Promise<OverviewMetrics> {
  const emptyMetric = { current: 0, previous: 0, changePercent: 0 };
  const empty: OverviewMetrics = {
    pageViews: { ...emptyMetric },
    uniqueVisitors: { ...emptyMetric },
    sessions: { ...emptyMetric },
    bounceRate: { ...emptyMetric },
  };

  try {
    const supabase = createAdminClient();
    const prev = getPreviousPeriodBounds(from, to);

    // Current period queries
    const [currentViews, currentVisitors, currentSessions] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "page_view")
        .gte("created_at", from)
        .lte("created_at", to),
      supabase
        .from("analytics_events")
        .select("visitor_id")
        .eq("event_type", "page_view")
        .gte("created_at", from)
        .lte("created_at", to),
      supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "page_view")
        .gte("created_at", from)
        .lte("created_at", to),
    ]);

    // Previous period queries
    const [prevViews, prevVisitors, prevSessions] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "page_view")
        .gte("created_at", prev.from)
        .lte("created_at", prev.to),
      supabase
        .from("analytics_events")
        .select("visitor_id")
        .eq("event_type", "page_view")
        .gte("created_at", prev.from)
        .lte("created_at", prev.to),
      supabase
        .from("analytics_events")
        .select("session_id")
        .eq("event_type", "page_view")
        .gte("created_at", prev.from)
        .lte("created_at", prev.to),
    ]);

    const currentViewCount = currentViews.count ?? 0;
    const prevViewCount = prevViews.count ?? 0;

    const currentUniqueVisitors = new Set(
      (currentVisitors.data ?? []).map((r) => r.visitor_id)
    ).size;
    const prevUniqueVisitors = new Set(
      (prevVisitors.data ?? []).map((r) => r.visitor_id)
    ).size;

    const currentSessionCount = new Set(
      (currentSessions.data ?? []).map((r) => r.session_id)
    ).size;
    const prevSessionCount = new Set(
      (prevSessions.data ?? []).map((r) => r.session_id)
    ).size;

    // Bounce rate: sessions with only 1 page view
    const sessionViewCounts = new Map<string, number>();
    for (const row of currentSessions.data ?? []) {
      sessionViewCounts.set(
        row.session_id,
        (sessionViewCounts.get(row.session_id) ?? 0) + 1
      );
    }
    const bouncedSessions = Array.from(sessionViewCounts.values()).filter(
      (c) => c === 1
    ).length;
    const currentBounceRate =
      currentSessionCount > 0
        ? Math.round((bouncedSessions / currentSessionCount) * 100)
        : 0;

    const prevSessionViewCounts = new Map<string, number>();
    for (const row of prevSessions.data ?? []) {
      prevSessionViewCounts.set(
        row.session_id,
        (prevSessionViewCounts.get(row.session_id) ?? 0) + 1
      );
    }
    const prevBouncedSessions = Array.from(
      prevSessionViewCounts.values()
    ).filter((c) => c === 1).length;
    const prevBounceRate =
      prevSessionCount > 0
        ? Math.round((prevBouncedSessions / prevSessionCount) * 100)
        : 0;

    return {
      pageViews: {
        current: currentViewCount,
        previous: prevViewCount,
        changePercent: calcChange(currentViewCount, prevViewCount),
      },
      uniqueVisitors: {
        current: currentUniqueVisitors,
        previous: prevUniqueVisitors,
        changePercent: calcChange(currentUniqueVisitors, prevUniqueVisitors),
      },
      sessions: {
        current: currentSessionCount,
        previous: prevSessionCount,
        changePercent: calcChange(currentSessionCount, prevSessionCount),
      },
      bounceRate: {
        current: currentBounceRate,
        previous: prevBounceRate,
        changePercent: calcChange(currentBounceRate, prevBounceRate),
      },
    };
  } catch (error) {
    console.error("getOverviewMetrics error:", error);
    return empty;
  }
}

/**
 * Get daily traffic trend data.
 */
export async function getTrafficTrend(
  from: string,
  to: string
): Promise<TrendData[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("created_at, visitor_id")
      .eq("event_type", "page_view")
      .gte("created_at", from)
      .lte("created_at", to)
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    // Group by date
    const dayMap = new Map<
      string,
      { views: number; visitors: Set<string> }
    >();

    for (const row of data) {
      const day = row.created_at.slice(0, 10); // YYYY-MM-DD
      if (!dayMap.has(day)) {
        dayMap.set(day, { views: 0, visitors: new Set() });
      }
      const entry = dayMap.get(day)!;
      entry.views++;
      entry.visitors.add(row.visitor_id);
    }

    return Array.from(dayMap.entries()).map(([date, { views, visitors }]) => ({
      date,
      page_views: views,
      visitors: visitors.size,
    }));
  } catch (error) {
    console.error("getTrafficTrend error:", error);
    return [];
  }
}

/**
 * Get top pages by view count.
 */
export async function getTopPages(
  from: string,
  to: string,
  limit = 10
): Promise<TopPagesData[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("page_path, visitor_id")
      .eq("event_type", "page_view")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const pageMap = new Map<
      string,
      { views: number; visitors: Set<string> }
    >();

    for (const row of data) {
      if (!pageMap.has(row.page_path)) {
        pageMap.set(row.page_path, { views: 0, visitors: new Set() });
      }
      const entry = pageMap.get(row.page_path)!;
      entry.views++;
      entry.visitors.add(row.visitor_id);
    }

    return Array.from(pageMap.entries())
      .map(([page_path, { views, visitors }]) => ({
        page_path,
        views,
        unique_visitors: visitors.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (error) {
    console.error("getTopPages error:", error);
    return [];
  }
}

/**
 * Get referrer statistics.
 */
export async function getReferrerStats(
  from: string,
  to: string,
  limit = 10
): Promise<ReferrerData[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("referrer")
      .eq("event_type", "page_view")
      .gte("created_at", from)
      .lte("created_at", to)
      .not("referrer", "is", null);

    if (error || !data) return [];

    const refMap = new Map<string, number>();
    for (const row of data) {
      const ref = row.referrer || "Direct";
      refMap.set(ref, (refMap.get(ref) ?? 0) + 1);
    }

    return Array.from(refMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error("getReferrerStats error:", error);
    return [];
  }
}

/**
 * Get device type distribution.
 */
export async function getDeviceStats(
  from: string,
  to: string
): Promise<DeviceData[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("device_type")
      .eq("event_type", "page_view")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const deviceMap = new Map<string, number>();
    for (const row of data) {
      const dt = row.device_type || "desktop";
      deviceMap.set(dt, (deviceMap.get(dt) ?? 0) + 1);
    }

    const total = data.length;
    return Array.from(deviceMap.entries())
      .map(([device_type, count]) => ({
        device_type,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("getDeviceStats error:", error);
    return [];
  }
}

/**
 * Get browser distribution.
 */
export async function getBrowserStats(
  from: string,
  to: string
): Promise<BrowserData[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("browser")
      .eq("event_type", "page_view")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const browserMap = new Map<string, number>();
    for (const row of data) {
      const b = row.browser || "Other";
      browserMap.set(b, (browserMap.get(b) ?? 0) + 1);
    }

    const total = data.length;
    return Array.from(browserMap.entries())
      .map(([browser, count]) => ({
        browser,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("getBrowserStats error:", error);
    return [];
  }
}

function calcChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Get CTA click stats.
 */
export async function getCtaClickStats(
  from: string,
  to: string
): Promise<{ name: string; count: number }[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_name, metadata")
      .in("event_type", ["click"])
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const map = new Map<string, number>();
    for (const row of data) {
      const label = row.event_name || "unknown";
      const text = (row.metadata as Record<string, string>)?.text || label;
      const key = `${label}: ${text}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  } catch (error) {
    console.error("getCtaClickStats error:", error);
    return [];
  }
}

/**
 * Get scroll depth stats per page.
 */
export async function getScrollDepthStats(
  from: string,
  to: string
): Promise<{ depth: number; count: number }[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("metadata")
      .eq("event_type", "custom")
      .eq("event_name", "scroll_depth")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const map = new Map<number, number>();
    for (const row of data) {
      const depth = (row.metadata as Record<string, number>)?.depth;
      if (depth) {
        map.set(depth, (map.get(depth) ?? 0) + 1);
      }
    }

    return [25, 50, 75, 100]
      .map((depth) => ({ depth, count: map.get(depth) ?? 0 }));
  } catch (error) {
    console.error("getScrollDepthStats error:", error);
    return [];
  }
}

/**
 * Get section view stats.
 */
export async function getSectionViewStats(
  from: string,
  to: string
): Promise<{ section: string; count: number }[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("metadata")
      .eq("event_type", "custom")
      .eq("event_name", "section_view")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const map = new Map<string, number>();
    for (const row of data) {
      const section = (row.metadata as Record<string, string>)?.section;
      if (section) {
        map.set(section, (map.get(section) ?? 0) + 1);
      }
    }

    return Array.from(map.entries())
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("getSectionViewStats error:", error);
    return [];
  }
}

/**
 * Get average time on page.
 */
export async function getTimeOnPageStats(
  from: string,
  to: string
): Promise<{ page: string; avgSeconds: number; count: number }[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("metadata")
      .eq("event_type", "custom")
      .eq("event_name", "time_on_page")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const map = new Map<string, { total: number; count: number }>();
    for (const row of data) {
      const meta = row.metadata as Record<string, string | number>;
      const page = (meta?.page as string) || "/";
      const seconds = Number(meta?.seconds) || 0;
      if (!map.has(page)) map.set(page, { total: 0, count: 0 });
      const entry = map.get(page)!;
      entry.total += seconds;
      entry.count++;
    }

    return Array.from(map.entries())
      .map(([page, { total, count }]) => ({
        page,
        avgSeconds: Math.round(total / count),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  } catch (error) {
    console.error("getTimeOnPageStats error:", error);
    return [];
  }
}

/**
 * Get UTM campaign stats.
 */
export async function getUtmStats(
  from: string,
  to: string
): Promise<{ source: string; medium: string; campaign: string; count: number }[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("utm_source, utm_medium, utm_campaign")
      .eq("event_type", "page_view")
      .not("utm_source", "is", null)
      .gte("created_at", from)
      .lte("created_at", to);

    if (error || !data) return [];

    const map = new Map<string, number>();
    for (const row of data) {
      const key = `${row.utm_source || "direct"}|${row.utm_medium || "-"}|${row.utm_campaign || "-"}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([key, count]) => {
        const [source, medium, campaign] = key.split("|");
        return { source, medium, campaign, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  } catch (error) {
    console.error("getUtmStats error:", error);
    return [];
  }
}
