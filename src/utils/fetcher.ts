import { getSession, removeSession } from "@/src/utils/session";

interface FetcherOptions extends RequestInit {
  headers?: HeadersInit;
}

export const fetcher = async <T = any>(url: string, options?: FetcherOptions): Promise<T> => {
  // Initialize Headers object with existing headers from options
  const headers = new Headers(options?.headers);

  // Set default Content-Type if not already present
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;

  // Correctly retrieve token using the session utility (handles prefixing)
  const accessToken = getSession('accessToken');

  // Ensure we don't send "undefined" or "null" as a string in the header
  if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Align URL with proxy: /api/proxy + backend resource path
  const response = await fetch(`/api/proxy/${cleanUrl}`, {
    ...options,
    headers: headers, // Pass the Headers object to fetch
  });

  if (!response.ok) {
    let errorDetail = `HTTP error! status: ${response.status}`;
    let errorJson: any = null;

    try {
      errorJson = await response.json();
      errorDetail += ` - ${JSON.stringify(errorJson)}`;

      // Capture token expiration and clear session
      if (response.status === 403 && errorJson?.message === 'Your session has expired. Please log in again.') {
        removeSession('accessToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } catch (e) {
      const errorText = await response.text().catch(() => "");
      if (errorText) errorDetail += ` - ${errorText}`;
    }
    throw new Error(errorDetail);
  }
  return response.json() as T;
};