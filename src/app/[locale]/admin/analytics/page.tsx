import {
  getOverviewMetrics,
  getTrafficTrend,
  getTopPages,
  getReferrerStats,
  getDeviceStats,
  getBrowserStats,
  getCtaClickStats,
  getScrollDepthStats,
  getSectionViewStats,
  getTimeOnPageStats,
  getUtmStats,
  getDateBounds,
} from "@/services/analytics/queries";
import type { AnalyticsDashboardData } from "@/types/analytics";
import { AnalyticsDashboardClient } from "./AnalyticsDashboardClient";

export default async function AnalyticsPage() {
  const { from, to } = getDateBounds("30d");

  const [
    overview, trend, topPages, referrers, devices, browsers,
    ctaClicks, scrollDepth, sectionViews, timeOnPage, utmStats,
  ] = await Promise.all([
    getOverviewMetrics(from, to),
    getTrafficTrend(from, to),
    getTopPages(from, to),
    getReferrerStats(from, to),
    getDeviceStats(from, to),
    getBrowserStats(from, to),
    getCtaClickStats(from, to),
    getScrollDepthStats(from, to),
    getSectionViewStats(from, to),
    getTimeOnPageStats(from, to),
    getUtmStats(from, to),
  ]);

  const initialData: AnalyticsDashboardData = {
    overview, trend, topPages, referrers, devices, browsers,
    ctaClicks, scrollDepth, sectionViews, timeOnPage, utmStats,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-base-content">Analytics</h1>
        <p className="text-base-content/60">마케팅 & 트래픽 분석</p>
      </div>
      <AnalyticsDashboardClient initialData={initialData} />
    </div>
  );
}
