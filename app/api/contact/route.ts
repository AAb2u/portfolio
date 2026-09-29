import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const field = (key: string, max: number) =>
    typeof body?.[key] === "string" ? body[key].trim().slice(0, max) : "";

  const firstName = field("firstName", 80);
  const lastName = field("lastName", 80);
  const email = field("email", 200);
  const message = field("message", 5000);

  if (!firstName || !lastName || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email not configured" }, { status: 500 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL || "akrourabdenour9@gmail.com",
      reply_to: email,
      subject: `New message from ${firstName} ${lastName}`,
      text: `From: ${firstName} ${lastName} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Send failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
