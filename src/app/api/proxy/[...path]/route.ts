import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3001";
const API_KEY = process.env.API_KEY || "";

async function handleProxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Extract the target path after /api
  const targetPath = pathname.replace(/^\/api\/proxy/, "/api");
  const targetUrl = `${API_URL}${targetPath}${search}`;

  const headers = new Headers(req.headers);

  // Ensure standard content type
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  // Robust check for Authorization header.
  // Use API Key fallback if header is missing or contains an invalid "undefined" value.
  const authHeader = headers.get("authorization");
  if ((!authHeader || authHeader.includes("undefined")) && API_KEY) {
    headers.set("X-API-Key", API_KEY);
  }

  // Clean up headers that can cause proxy issues
  headers.delete("host");
  headers.delete("content-length");

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.blob() : undefined,
      cache: "no-store",
    });

    const data = await response.blob();
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
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
