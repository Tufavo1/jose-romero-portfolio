import { NextResponse } from "next/server";
import { readContactSettings, writeContactSettings } from "@/lib/admin-data";
import { profile } from "@/data/profile";

export async function GET() {
  const data = await readContactSettings();
  return NextResponse.json({
    email: data.email || profile.email,
    formEnabled: data.form_enabled,
  });
}

export async function PUT(request: Request) {
  const { email, formEnabled } = await request.json();
  await writeContactSettings(email, formEnabled);
  return NextResponse.json({ ok: true });
}
