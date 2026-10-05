import { NextRequest } from "next/server";
import { signedUploadRedirect } from "@/src/lib/uploads/signedUploadRedirect";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileid: string }> },
) {
  const { fileid } = await params;
  const download = request.nextUrl.searchParams.get("download") !== "false";
  return signedUploadRedirect(fileid, download);
}
