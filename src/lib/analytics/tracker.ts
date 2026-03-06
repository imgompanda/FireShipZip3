import type { AnalyticsEvent } from "@/types/analytics";
import {
  BATCH_INTERVAL_MS,
  MAX_BATCH_SIZE,
  TRACK_ENDPOINT,
} from "./constants";
import {
  getOrCreateVisitorId,
  getOrCreateSessionId,
  parseUserAgent,
  extractUTMParams,
} from "./utils";

let eventBuffer: Partial<AnalyticsEvent>[] = [];
let batchTimer: ReturnType<typeof setInterval> | null = null;
let initialized = false;

/**
 * Initialize the analytics tracker.
 * Sets up batch flushing on an interval and before page unload.
 */
export function initAnalytics() {
  if (typeof window === "undefined" || initialized) return;
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
  initialized = true;

  // Flush on interval
  batchTimer = setInterval(flush, BATCH_INTERVAL_MS);

  // Flush before page unload
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flush();
    }
  });

  window.addEventListener("pagehide", flush);
}

/**
 * Track a page view event.
 */
export function trackPageView(path: string, title?: string) {
  enqueue({
    event_type: "page_view",
    page_path: path,
    page_title: title || document.title,
    referrer: document.referrer || undefined,
  });
}

/**
 * Track a click event.
 */
export function trackClick(
  name: string,
  metadata?: Record<string, string | number | boolean>
) {
  enqueue({
    event_type: "click",
    event_name: name,
    page_path: window.location.pathname,
    metadata,
  });
}

/**
 * Track a custom event.
 */
export function trackCustom(
  name: string,
  metadata?: Record<string, string | number | boolean>
) {
  enqueue({
    event_type: "custom",
    event_name: name,
    page_path: window.location.pathname,
    metadata,
  });
}

/**
 * Flush the event buffer by sending batched events to the server.
 */
export function flush() {
  if (eventBuffer.length === 0) return;

  const batch = eventBuffer.splice(0, MAX_BATCH_SIZE);
  const payload = JSON.stringify({ events: batch });

  // Use sendBeacon for reliable delivery during page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      TRACK_ENDPOINT,
      new Blob([payload], { type: "application/json" })
    );
  } else {
    fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Silently fail - analytics should not break the app
    });
  }
}

/**
 * Add an event to the buffer with common fields populated.
 */
function enqueue(partial: Partial<AnalyticsEvent>) {
  if (typeof window === "undefined") return;

  const { browser, os, device_type } = parseUserAgent();
  const utm = extractUTMParams();

  const event: Partial<AnalyticsEvent> = {
    visitor_id: getOrCreateVisitorId(),
    session_id: getOrCreateSessionId(),
    device_type,
    browser,
    os,
    locale: document.documentElement.lang || undefined,
    ...utm,
    ...partial,
    created_at: new Date().toISOString(),
  };

  eventBuffer.push(event);

  // Flush immediately if buffer is full
  if (eventBuffer.length >= MAX_BATCH_SIZE) {
    flush();
  }
}

/**
 * Cleanup: stop batch timer.
 */
export function destroyAnalytics() {
  if (batchTimer) {
    clearInterval(batchTimer);
    batchTimer = null;
  }
  flush();
  initialized = false;
}
