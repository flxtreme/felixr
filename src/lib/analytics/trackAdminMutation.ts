type MutationAction = "insert" | "update" | "soft_delete" | "delete";
type MutationChanges = Record<string, unknown>;

function redactSensitiveValues(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitiveValues);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !/(password|token|secret|authorization)/i.test(key))
      .map(([key, item]) => [key, redactSensitiveValues(item)]),
  );
}

async function getTrackSnapshot<T>(load?: () => Promise<T>): Promise<T | undefined> {
  if (!load) return undefined;
  try {
    return await load();
  } catch {
    return undefined;
  }
}

function getVisitorId() {
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

function encodeChunk(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

function toEncodedPayload(json: string) {
  const characters = Array.from(json);
  const chunks: string[] = [];
  for (let index = 0; index < characters.length; index += 100) {
    const prefix = String(Math.floor(index / 100)).padStart(2, "0");
    chunks.push(encodeChunk(`${prefix}~~~${characters.slice(index, index + 100).join("")}`));
  }
  return chunks;
}

async function sendAdminMutationTrack(action: MutationAction, path: string[], changes?: MutationChanges) {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      visitorId: getVisitorId(),
      action,
      path,
      currentUrl: window.location.href,
      parameters: Object.fromEntries(new URLSearchParams(window.location.search)),
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
      ...(changes ? { changes: redactSensitiveValues(changes) } : {}),
    };

    const response = await fetch("/api/proxy/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: toEncodedPayload(JSON.stringify(payload)) }),
      keepalive: true,
    });
    const result = await response.json().catch(() => null) as { success?: boolean } | null;
    if (!response.ok || result?.success === false) {
      console.warn("[Track] Admin mutation event was not saved.", { action, path, status: response.status });
    }
  } catch {
    // Analytics must not interfere with the requested admin mutation.
  }
}

export function trackAdminMutationError(path: string[], error: string) {
  void sendAdminMutationTrack("insert", path, { error });
}

type TrackAdminMutationOptions<T> = {
  action: MutationAction;
  path: string[] | ((result: T) => string[]);
  mutate: () => Promise<T>;
  getPrevious?: () => Promise<unknown>;
};

export async function trackAdminMutation<T>({ action, path, mutate, getPrevious }: TrackAdminMutationOptions<T>): Promise<T> {
  const previous = action === "insert" ? undefined : await getTrackSnapshot(getPrevious);
  const result = await mutate();
  const resolvedPath = typeof path === "function" ? path(result) : path;
  const changes: MutationChanges | undefined = action === "insert"
    ? { data: {}, update: result as unknown as Record<string, unknown> }
    : previous !== undefined && previous !== null
      ? { data: previous as Record<string, unknown>, update: result as unknown as Record<string, unknown> }
      : undefined;

  await sendAdminMutationTrack(action, resolvedPath, changes);
  return result;
}
