import { getSession, removeSession } from "@/src/utils/session";
import errorEmitter from "./errorEmitter";

interface FetcherOptions extends RequestInit {
  headers?: HeadersInit;
}

interface ApiError {
  message: string;
  data: unknown;
}

export const fetcher = async <T = unknown>(
  url: string,
  options?: FetcherOptions
): Promise<T> => {
  const headers = new Headers(options?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;

  const accessToken = getSession("accessToken");

  if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(`/api/proxy/${cleanUrl}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`;
      let data: unknown = null;

      try {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          const errorJson = (await response.json()) as Partial<ApiError>;

          message = errorJson.message ?? message;
          data = errorJson.data ?? null;

          if (
            response.status === 403 &&
            errorJson?.message === "Your session has expired. Please log in again."
          ) {
            removeSession("accessToken");
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } else {
          data = await response.text();
        }
      } catch (parseError) {
        console.error("[Fetcher] Failed to parse error response:", parseError);
      }

      console.error("[Fetcher] API error:", { status: response.status, url: cleanUrl, data });
      throw new Error(message);
    }

    const contentType = response.headers.get("content-type");

    if (!contentType) throw new Error("No content type");

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
  } catch (error) { 
    errorEmitter.emit(error as Error);
    throw error;
  }
};