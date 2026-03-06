-- =============================================
-- Analytics Events Table
-- =============================================
-- Stores all analytics events (page views, clicks, custom events)
-- collected by the client-side tracker SDK.

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'click', 'custom')),
  event_name TEXT,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  device_type TEXT DEFAULT 'desktop' CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  browser TEXT DEFAULT 'unknown',
  os TEXT DEFAULT 'unknown',
  country TEXT,
  locale TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================
-- Row Level Security
-- =============================================
-- Only service_role (admin) can insert/read analytics.
-- Public users cannot access analytics data.

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow service_role to do everything (RLS is bypassed for service_role by default)
-- No policies needed for regular users since they should not access this table.

-- =============================================
-- Indexes
-- =============================================
-- Primary query patterns:
-- 1. Filter by event_type + created_at range (overview metrics, trend)
-- 2. Group by page_path (top pages)
-- 3. Group by visitor_id (unique visitors)
-- 4. Group by session_id (session count, bounce rate)

CREATE INDEX idx_analytics_events_type_created
  ON analytics_events (event_type, created_at DESC);

CREATE INDEX idx_analytics_events_created
  ON analytics_events (created_at DESC);

CREATE INDEX idx_analytics_events_visitor
  ON analytics_events (visitor_id, created_at DESC);

CREATE INDEX idx_analytics_events_session
  ON analytics_events (session_id);

CREATE INDEX idx_analytics_events_page
  ON analytics_events (page_path, created_at DESC);

-- =============================================
-- Materialized View: Daily Stats
-- =============================================
-- Pre-aggregated daily statistics for fast dashboard loading.
-- Refresh periodically via cron or manually.

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily_stats AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) FILTER (WHERE event_type = 'page_view') AS page_views,
  COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'page_view') AS unique_visitors,
  COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'page_view') AS sessions
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY day DESC;

CREATE UNIQUE INDEX idx_analytics_daily_stats_day
  ON analytics_daily_stats (day);

-- Refresh command (run via pg_cron or manually):
-- REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_stats;
