import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=2500`;
  const res = await fetch(apiUrl, { next: { revalidate: 86400 } });

  if (!res.ok) return NextResponse.json({ error: "Screenshot failed" }, { status: 500 });

  const imageBuffer = await res.arrayBuffer();
  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
