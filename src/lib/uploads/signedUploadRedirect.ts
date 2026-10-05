const API_URL = process.env.API_URL || "http://localhost:3200";
const API_KEY = process.env.API_KEY || "";

export async function signedUploadRedirect(fileId: string, download: boolean) {
  if (!API_KEY) {
    return Response.json(
      { message: "The server API_KEY is required to create a stable upload link." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const query = download ? "?download=true" : "";
  const endpoint = `${API_URL.replace(/\/$/, "")}/api/admin/upload/${encodeURIComponent(fileId)}/signed-url${query}`;

  try {
    const response = await fetch(endpoint, {
      headers: API_KEY ? { "X-API-Key": API_KEY } : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      const responseText = await response.text();
      let detail = "";
      try {
        const errorBody = JSON.parse(responseText) as { message?: string };
        detail = errorBody.message ?? "";
      } catch {
        detail = responseText;
      }
      return Response.json(
        { message: detail || `Could not create a temporary file URL (API returned ${response.status}).` },
        { status: response.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { url } = await response.json() as { url?: string };
    if (!url) {
      return Response.json(
        { message: "The upload service did not return a file URL." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const destination = new URL(url);
    if (destination.protocol !== "http:" && destination.protocol !== "https:") {
      return Response.json(
        { message: "The upload service returned an invalid file URL." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return new Response(null, {
      status: 302,
      headers: { Location: destination.toString(), "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { message: "Could not create a temporary file URL." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
