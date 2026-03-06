"use server";

import type { AnalyticsDashboardData, DateRange } from "@/types/analytics";
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

export async function fetchAnalyticsData(
  range: DateRange
): Promise<AnalyticsDashboardData> {
  const { from, to } = getDateBounds(range);

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

  return {
    overview, trend, topPages, referrers, devices, browsers,
    ctaClicks, scrollDepth, sectionViews, timeOnPage, utmStats,
  };
}
