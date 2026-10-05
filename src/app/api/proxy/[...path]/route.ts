import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3200";
const API_KEY = process.env.API_KEY || "";

async function handleProxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasBody = req.method !== "GET" && req.method !== "HEAD" && req.body !== null;

  // Extract the target path after /api
  const targetPath = pathname.replace(/^\/api\/proxy/, "/api");
  const targetUrl = `${API_URL}${targetPath}${search}`;

  const headers = new Headers(req.headers);
  const isMultipart = headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data") ?? false;

  // Ensure standard content type
  if (hasBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (!hasBody) headers.delete("content-type");

  // Robust check for Authorization header.
  // Use API Key fallback if header is missing or contains an invalid "undefined" value.
  const authHeader = headers.get("authorization");
  if ((!authHeader || authHeader.includes("undefined")) && API_KEY) {
    headers.set("X-API-Key", API_KEY);
  }

  // Clean up headers that can cause proxy issues
  headers.delete("host");
  headers.delete("content-length");
  if (isMultipart) headers.delete("content-type");

  try {
    const body: BodyInit | undefined = !hasBody
      ? undefined
      : isMultipart
        ? await req.formData()
        : await req.blob();

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body,
      cache: "no-store",
    });

    const data = await response.blob();

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding"); // ← body is already decoded by fetch
    responseHeaders.delete("content-length");   // ← length no longer matches after decode

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
