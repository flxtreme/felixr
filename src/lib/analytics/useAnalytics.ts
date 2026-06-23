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

  const { state } = await navigator.permissions.query({ name: "geolocation" });

  if (state !== "granted") {
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
  const previousUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const trackView = async () => {
      try {
        const visitorId = getOrCreateVisitorId();

        const currentUrl = window.location.href;

        // Derive path array from pathname
        // e.g. /blog/my-post → ["blog", "my-post"], / → []
        const path = pathname.split("/").filter(Boolean);

        const parameters: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          parameters[key] = value;
        });

        const from = {
          referrer: document.referrer || undefined,
          previousUrl: previousUrlRef.current,
          historyLength: window.history.length,
        };

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

        const location = await getLocation();

        const payload = {
          visitorId,
          path,
          currentUrl,
          parameters,
          from,
          visitor,
          location,
          timestamp: new Date().toISOString(),
        };

        const raw = JSON.stringify(payload);

        const rawChunks: string[] = [];
        for (let i = 0; i < raw.length; i += 100) {
          const index = String(Math.floor(i / 100)).padStart(2, "0");
          rawChunks.push(`${index}~~~${raw.slice(i, i + 100)}`);
        }

        const encodedChunks = rawChunks.map((chunk) =>
          btoa(unescape(encodeURIComponent(chunk)))
        );

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

        previousUrlRef.current = currentUrl;
      } catch (err) {
        console.error("[analytics] failed to track view:", err);
      }
    };

    trackView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);
}