import { NextResponse } from "next/server";
import { readOverride, writeOverride } from "@/lib/admin-data";
import { validateCsrfRequest } from "@/lib/csrf";
import { profile } from "@/data/profile";

export async function GET() {
  const data = readOverride("profile", profile);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const csrf = await validateCsrfRequest(request);
  if (csrf) return csrf;

  const body = await request.json();
  writeOverride("profile", body);
  return NextResponse.json({ ok: true });
}
