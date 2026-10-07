export type UserAction = "download" | "redirect" | "view";

export type TrackUserActionOptions = {
  action: UserAction;
  path: string[];
  parameters?: Record<string, unknown>;
};

function getVisitorId(): string {
  const key = "visitor_id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, id);
  }
  return id;
}

function encodeChunk(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

function toEncodedPayload(json: string): string[] {
  const characters = Array.from(json);
  const chunks: string[] = [];
  for (let index = 0; index < characters.length; index += 100) {
    const prefix = String(Math.floor(index / 100)).padStart(2, "0");
    chunks.push(encodeChunk(`${prefix}~~~${characters.slice(index, index + 100).join("")}`));
  }
  return chunks;
}

export async function trackUserAction({ action, path, parameters }: TrackUserActionOptions): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const visitorId = getVisitorId();
    const payload = {
      visitorId,
      action,
      path,
      currentUrl: window.location.href,
      parameters: parameters ?? Object.fromEntries(new URLSearchParams(window.location.search)),
      from: { referrer: document.referrer || undefined },
      visitor: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        screen: { width: window.screen.width, height: window.screen.height },
      },
      location: { enabled: false },
      timestamp: new Date().toISOString(),
    };

    await fetch("/api/proxy/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: toEncodedPayload(JSON.stringify(payload)) }),
      keepalive: true,
    });
  } catch (err) {
    console.warn("[Track] Failed to send user action:", err);
  }
}
