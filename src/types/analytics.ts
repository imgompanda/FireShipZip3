// Analytics event types and interfaces

export interface AnalyticsEvent {
  id?: string;
  visitor_id: string;
  session_id: string;
  event_type: "page_view" | "click" | "custom";
  event_name?: string;
  page_path: string;
  page_title?: string;
  referrer?: string;
  device_type: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  country?: string;
  locale?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  metadata?: Record<string, string | number | boolean>;
  created_at?: string;
}

export type DateRange = "7d" | "30d" | "90d" | "ytd";

export interface MetricData {
  current: number;
  previous: number;
  changePercent: number;
}

export interface TopPagesData {
  page_path: string;
  views: number;
  unique_visitors: number;
}

export interface TrendData {
  date: string;
  page_views: number;
  visitors: number;
}

export interface DeviceData {
  device_type: string;
  count: number;
  percent: number;
}

export interface BrowserData {
  browser: string;
  count: number;
  percent: number;
}

export interface ReferrerData {
  referrer: string;
  count: number;
}

export interface OverviewMetrics {
  pageViews: MetricData;
  uniqueVisitors: MetricData;
  sessions: MetricData;
  bounceRate: MetricData;
}

export interface CtaClickData {
  name: string;
  count: number;
}

export interface ScrollDepthData {
  depth: number;
  count: number;
}

export interface SectionViewData {
  section: string;
  count: number;
}

export interface TimeOnPageData {
  page: string;
  avgSeconds: number;
  count: number;
}

export interface UtmData {
  source: string;
  medium: string;
  campaign: string;
  count: number;
}

export interface AnalyticsDashboardData {
  overview: OverviewMetrics;
  trend: TrendData[];
  topPages: TopPagesData[];
  referrers: ReferrerData[];
  devices: DeviceData[];
  browsers: BrowserData[];
  ctaClicks: CtaClickData[];
  scrollDepth: ScrollDepthData[];
  sectionViews: SectionViewData[];
  timeOnPage: TimeOnPageData[];
  utmStats: UtmData[];
}
