import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
  const res = await fetch(apiUrl, { next: { revalidate: 86400 } }); // cache 24h

  if (!res.ok) return NextResponse.json({ error: "Screenshot failed" }, { status: 500 });

  const screenshotUrl = await res.text();
  return NextResponse.redirect(screenshotUrl.trim());
}
