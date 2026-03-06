import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { AnalyticsEvent } from "@/types/analytics";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 60; // requests per minute
const RATE_LIMIT_WINDOW = 60_000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const events: Partial<AnalyticsEvent>[] = body.events;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload: events array required" },
        { status: 400 }
      );
    }

    if (events.length > 50) {
      return NextResponse.json(
        { error: "Too many events in batch (max 50)" },
        { status: 400 }
      );
    }

    // Extract country from Vercel header
    const country =
      request.headers.get("x-vercel-ip-country") || undefined;

    // Enrich events with server-side data
    const enrichedEvents = events
      .filter(
        (e) => e.visitor_id && e.session_id && e.event_type && e.page_path
      )
      .map((event) => ({
        visitor_id: event.visitor_id,
        session_id: event.session_id,
        event_type: event.event_type,
        event_name: event.event_name || null,
        page_path: event.page_path,
        page_title: event.page_title || null,
        referrer: event.referrer || null,
        device_type: event.device_type || "desktop",
        browser: event.browser || "unknown",
        os: event.os || "unknown",
        country: event.country || country || null,
        locale: event.locale || null,
        utm_source: event.utm_source || null,
        utm_medium: event.utm_medium || null,
        utm_campaign: event.utm_campaign || null,
        utm_term: event.utm_term || null,
        utm_content: event.utm_content || null,
        metadata: event.metadata || null,
        created_at: event.created_at || new Date().toISOString(),
      }));

    if (enrichedEvents.length === 0) {
      return NextResponse.json(
        { error: "No valid events after filtering" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("analytics_events")
      .insert(enrichedEvents);

    if (error) {
      console.error("Analytics insert error:", error);
      // Return 200 anyway to not break client-side
      return NextResponse.json({ ok: true, stored: 0 });
    }

    return NextResponse.json({ ok: true, stored: enrichedEvents.length });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ ok: true, stored: 0 });
  }
}
