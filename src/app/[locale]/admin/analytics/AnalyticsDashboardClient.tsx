"use client";

import { useState, useTransition } from "react";
import {
  Eye, Users, Activity, TrendingDown,
  MousePointerClick, Timer, Layers, Target,
} from "lucide-react";
import type {
  AnalyticsDashboardData,
  DateRange,
} from "@/types/analytics";
import {
  MetricCard,
  TrendChart,
  BarChartCard,
  PieChartCard,
  DateRangePicker,
} from "@/components/admin/analytics";
import { fetchAnalyticsData } from "./actions";

interface AnalyticsDashboardClientProps {
  initialData: AnalyticsDashboardData;
}

export function AnalyticsDashboardClient({
  initialData,
}: AnalyticsDashboardClientProps) {
  const [data, setData] = useState(initialData);
  const [range, setRange] = useState<DateRange>("30d");
  const [isPending, startTransition] = useTransition();

  function handleRangeChange(newRange: DateRange) {
    setRange(newRange);
    startTransition(async () => {
      const newData = await fetchAnalyticsData(newRange);
      setData(newData);
    });
  }

  const {
    overview, trend, topPages, referrers, devices, browsers,
    ctaClicks, scrollDepth, sectionViews, timeOnPage, utmStats,
  } = data;

  const totalCtaClicks = ctaClicks.reduce((sum, c) => sum + c.count, 0);
  const avgTimeOnPage = timeOnPage.length > 0
    ? Math.round(timeOnPage.reduce((sum, t) => sum + t.avgSeconds, 0) / timeOnPage.length)
    : 0;
  const deepScrollRate = scrollDepth.length > 0
    ? Math.round(((scrollDepth.find((s) => s.depth === 75)?.count ?? 0) / Math.max(overview.pageViews.current, 1)) * 100)
    : 0;

  return (
    <div className={`space-y-8 ${isPending ? "opacity-60" : ""}`}>
      {/* Date Range Picker */}
      <DateRangePicker value={range} onChange={handleRangeChange} />

      {/* === Overview Metrics === */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-4">트래픽 개요</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="페이지뷰"
            value={overview.pageViews.current.toLocaleString()}
            change={overview.pageViews.changePercent}
            icon={Eye}
            color="oklch(var(--p))"
          />
          <MetricCard
            title="방문자"
            value={overview.uniqueVisitors.current.toLocaleString()}
            change={overview.uniqueVisitors.changePercent}
            icon={Users}
            color="oklch(var(--in))"
          />
          <MetricCard
            title="세션"
            value={overview.sessions.current.toLocaleString()}
            change={overview.sessions.changePercent}
            icon={Activity}
            color="oklch(var(--wa))"
          />
          <MetricCard
            title="이탈률"
            value={`${overview.bounceRate.current}%`}
            change={overview.bounceRate.changePercent}
            icon={TrendingDown}
            color="oklch(var(--er))"
          />
        </div>
      </div>

      {/* === Engagement Metrics === */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-4">사용자 행동</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="CTA 클릭"
            value={totalCtaClicks.toLocaleString()}
            change={0}
            icon={MousePointerClick}
            color="oklch(var(--su))"
          />
          <MetricCard
            title="평균 체류시간"
            value={`${avgTimeOnPage}초`}
            change={0}
            icon={Timer}
            color="oklch(var(--in))"
          />
          <MetricCard
            title="75% 스크롤 도달"
            value={`${deepScrollRate}%`}
            change={0}
            icon={Layers}
            color="oklch(var(--wa))"
          />
          <MetricCard
            title="UTM 유입"
            value={utmStats.reduce((sum, u) => sum + u.count, 0).toLocaleString()}
            change={0}
            icon={Target}
            color="oklch(var(--p))"
          />
        </div>
      </div>

      {/* Traffic Trend */}
      <TrendChart
        data={trend as unknown as Record<string, string | number>[]}
        lines={[
          { key: "page_views", label: "페이지뷰", color: "oklch(var(--p))" },
          { key: "visitors", label: "방문자", color: "oklch(var(--in))" },
        ]}
        title="트래픽 추이"
      />

      {/* === Scroll Depth & Section Funnel === */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-4">콘텐츠 성과</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Scroll Depth */}
          <div className="bg-base-200 rounded-xl border border-neutral p-6">
            <h3 className="text-sm font-bold text-base-content mb-4">스크롤 깊이</h3>
            <div className="space-y-3">
              {scrollDepth.map((s) => {
                const maxCount = Math.max(...scrollDepth.map((d) => d.count), 1);
                const width = Math.round((s.count / maxCount) * 100);
                return (
                  <div key={s.depth}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-base-content/70">{s.depth}%</span>
                      <span className="text-base-content/50">{s.count}명</span>
                    </div>
                    <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Views */}
          <div className="bg-base-200 rounded-xl border border-neutral p-6">
            <h3 className="text-sm font-bold text-base-content mb-4">섹션 도달률</h3>
            <div className="space-y-3">
              {sectionViews.map((s) => {
                const maxCount = Math.max(...sectionViews.map((d) => d.count), 1);
                const width = Math.round((s.count / maxCount) * 100);
                return (
                  <div key={s.section}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-base-content/70 font-medium">{s.section}</span>
                      <span className="text-base-content/50">{s.count}회</span>
                    </div>
                    <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-info rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {sectionViews.length === 0 && (
                <p className="text-xs text-base-content/40">아직 데이터가 없어요</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === CTA Clicks & Time on Page === */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-4">전환 분석</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CTA Clicks */}
          <div className="bg-base-200 rounded-xl border border-neutral p-6">
            <h3 className="text-sm font-bold text-base-content mb-4">CTA 클릭 상세</h3>
            <div className="space-y-2">
              {ctaClicks.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-neutral last:border-0">
                  <span className="text-xs text-base-content/70 truncate max-w-[70%]">{c.name}</span>
                  <span className="text-xs font-bold text-primary">{c.count}</span>
                </div>
              ))}
              {ctaClicks.length === 0 && (
                <p className="text-xs text-base-content/40">아직 데이터가 없어요</p>
              )}
            </div>
          </div>

          {/* Time on Page */}
          <div className="bg-base-200 rounded-xl border border-neutral p-6">
            <h3 className="text-sm font-bold text-base-content mb-4">페이지별 평균 체류시간</h3>
            <div className="space-y-2">
              {timeOnPage.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-neutral last:border-0">
                  <span className="text-xs text-base-content/70 truncate max-w-[60%]">{t.page}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-base-content">{t.avgSeconds}초</span>
                    <span className="text-[10px] text-base-content/40 ml-2">({t.count}명)</span>
                  </div>
                </div>
              ))}
              {timeOnPage.length === 0 && (
                <p className="text-xs text-base-content/40">아직 데이터가 없어요</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === UTM Campaign Stats === */}
      {utmStats.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-base-content mb-4">UTM 캠페인</h2>
          <div className="bg-base-200 rounded-xl border border-neutral p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-base-content/50 border-b border-neutral">
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Medium</th>
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium text-right">방문</th>
                </tr>
              </thead>
              <tbody>
                {utmStats.map((u, i) => (
                  <tr key={i} className="border-b border-neutral last:border-0">
                    <td className="py-2.5 text-base-content/70">{u.source}</td>
                    <td className="py-2.5 text-base-content/70">{u.medium}</td>
                    <td className="py-2.5 text-base-content/70">{u.campaign}</td>
                    <td className="py-2.5 text-right font-bold text-primary">{u.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === Standard Charts === */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-4">상세 분석</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarChartCard
            data={topPages.map((p) => ({
              name: p.page_path.length > 30
                ? p.page_path.slice(0, 30) + "..."
                : p.page_path,
              views: p.views,
              unique: p.unique_visitors,
            }))}
            bars={[
              { key: "views", label: "조회수", color: "oklch(var(--p))" },
              { key: "unique", label: "방문자", color: "oklch(var(--in))" },
            ]}
            title="인기 페이지"
            layout="vertical"
            height={400}
          />
          <BarChartCard
            data={referrers.map((r) => ({
              name: r.referrer.length > 30
                ? r.referrer.slice(0, 30) + "..."
                : r.referrer,
              count: r.count,
            }))}
            bars={[{ key: "count", label: "유입", color: "oklch(var(--wa))" }]}
            title="유입 경로"
            layout="vertical"
            height={400}
          />
        </div>
      </div>

      {/* Device & Browser */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PieChartCard
          data={devices.map((d) => ({
            name: d.device_type,
            value: d.count,
          }))}
          title="디바이스 분포"
        />
        <PieChartCard
          data={browsers.map((b) => ({
            name: b.browser,
            value: b.count,
          }))}
          title="브라우저 분포"
        />
      </div>
    </div>
  );
}
