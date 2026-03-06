import { ANALYTICS_COOKIE_NAME, SESSION_TIMEOUT_MS } from "./constants";

const SESSION_KEY = "fs_sid";
const SESSION_TS_KEY = "fs_sid_ts";

/**
 * Get or create a persistent visitor ID.
 * Stored in both localStorage and a cookie for server access.
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  // Try localStorage first
  let vid = localStorage.getItem(ANALYTICS_COOKIE_NAME);
  if (vid) return vid;

  // Try cookie
  vid = getCookie(ANALYTICS_COOKIE_NAME);
  if (vid) {
    localStorage.setItem(ANALYTICS_COOKIE_NAME, vid);
    return vid;
  }

  // Create new
  vid = crypto.randomUUID();
  localStorage.setItem(ANALYTICS_COOKIE_NAME, vid);
  setCookie(ANALYTICS_COOKIE_NAME, vid, 365);
  return vid;
}

/**
 * Get or create a session ID.
 * Sessions expire after SESSION_TIMEOUT_MS of inactivity.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  const now = Date.now();
  const existingSid = sessionStorage.getItem(SESSION_KEY);
  const lastActivity = sessionStorage.getItem(SESSION_TS_KEY);

  if (
    existingSid &&
    lastActivity &&
    now - parseInt(lastActivity, 10) < SESSION_TIMEOUT_MS
  ) {
    sessionStorage.setItem(SESSION_TS_KEY, now.toString());
    return existingSid;
  }

  const sid = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, sid);
  sessionStorage.setItem(SESSION_TS_KEY, now.toString());
  return sid;
}

/**
 * Parse user agent string to extract browser, OS, and device type.
 */
export function parseUserAgent(): {
  browser: string;
  os: string;
  device_type: "desktop" | "mobile" | "tablet";
} {
  if (typeof navigator === "undefined") {
    return { browser: "unknown", os: "unknown", device_type: "desktop" };
  }

  const ua = navigator.userAgent;

  // Browser detection
  let browser = "Other";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR/")) browser = "Opera";

  // OS detection
  let os = "Other";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  // Device type detection
  let device_type: "desktop" | "mobile" | "tablet" = "desktop";
  if (/iPad|tablet/i.test(ua)) device_type = "tablet";
  else if (/Mobile|Android|iPhone/i.test(ua)) device_type = "mobile";

  return { browser, os, device_type };
}

/**
 * Extract UTM parameters from the current URL.
 */
export function extractUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return utm;
}

// Cookie helpers
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}
