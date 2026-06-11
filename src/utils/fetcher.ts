import { getSession, removeSession } from "@/src/utils/session";

interface FetcherOptions extends RequestInit {
  headers?: HeadersInit;
}

export const fetcher = async <T = any>(
  url: string,
  options?: FetcherOptions
): Promise<T> => {
  const headers = new Headers(options?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;

  const accessToken = getSession("accessToken");

  if (
    accessToken &&
    accessToken !== "undefined" &&
    accessToken !== "null"
  ) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`/api/proxy/${cleanUrl}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `HTTP error! status: ${response.status}`;

    try {
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();

        errorDetail += ` - ${JSON.stringify(errorJson)}`;

        if (
          response.status === 403 &&
          errorJson?.message ===
            "Your session has expired. Please log in again."
        ) {
          removeSession("accessToken");

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } else {
        const errorText = await response.text();

        if (errorText) {
          errorDetail += ` - ${errorText}`;
        }
      }
    } catch {
    }

    throw new Error(errorDetail);
  }

  const contentType = response.headers.get("content-type");

  if (!contentType) {
    return undefined as T;
  }

  if (
    contentType.includes("application/json") ||
    contentType.includes("application/problem+json")
  ) {
    return (await response.json()) as T;
  }

  if (
    contentType.includes("text/plain") ||
    contentType.includes("text/html") ||
    contentType.includes("text/markdown")
  ) {
    return (await response.text()) as T;
  }

  return (await response.text()) as T;
};