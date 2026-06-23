"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Persistent visitor ID stored in localStorage
function getOrCreateVisitorId(): string {
  const key = "visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

async function getLocation(): Promise<{
  enabled: boolean;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  mapsUrl?: string;
}> {
  if (!navigator.geolocation || !navigator.permissions) {
    return { enabled: false };
  }

  // Check existing permission state — never trigger a prompt
  const { state } = await navigator.permissions.query({ name: "geolocation" });

  if (state !== "granted") {
    // "prompt" or "denied" — don't ask, just skip
    return { enabled: false };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        resolve({
          enabled: true,
          latitude: lat,
          longitude: lng,
          accuracy: pos.coords.accuracy,
          mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      () => {
        resolve({ enabled: false });
      },
      { timeout: 5000 }
    );
  });
}

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // useRef persists across re-renders without triggering them
  const previousUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const trackView = async () => {
      try {
        const visitorId = getOrCreateVisitorId();

        // Build current URL
        const currentUrl = window.location.href;

        // Parse query parameters into a plain object
        const parameters: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          parameters[key] = value;
        });

        // Navigation context
        const from = {
          referrer: document.referrer || undefined,
          previousUrl: previousUrlRef.current,
          historyLength: window.history.length,
        };

        // Visitor info
        const visitor = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          screen: {
            width: window.screen.width,
            height: window.screen.height,
          },
        };

        // Geolocation (non-blocking — resolves quickly either way)
        const location = await getLocation();

        const payload = {
          visitorId,
          currentUrl,
          parameters,
          from,
          visitor,
          location,
          timestamp: new Date().toISOString(),
        };

        // 1. JSON stringify
        const raw = JSON.stringify(payload);

        // 2. Split into 100-char chunks and prefix each with its zero-padded index
        //    e.g. "00:first100chars", "01:next100chars", ...
        const rawChunks: string[] = [];
        for (let i = 0; i < raw.length; i += 100) {
          const index = String(Math.floor(i / 100)).padStart(2, "0");
          rawChunks.push(`${index}~~~${raw.slice(i, i + 100)}`);
        }

        // 3. Base64-encode each indexed chunk individually
        const encodedChunks = rawChunks.map((chunk) =>
          btoa(unescape(encodeURIComponent(chunk)))
        );

        // 4. Shuffle so order is not obvious
        for (let i = encodedChunks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [encodedChunks[i], encodedChunks[j]] = [encodedChunks[j], encodedChunks[i]];
        }

        await fetch("/api/proxy/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: encodedChunks }),
          keepalive: true,
        });

        // Store current URL for the next navigation
        previousUrlRef.current = currentUrl;
      } catch (err) {
        // Never let analytics crash the app
        console.error("[analytics] failed to track view:", err);
      }
    };

    trackView();
    // Re-run on every route change (pathname + searchParams together)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);
}