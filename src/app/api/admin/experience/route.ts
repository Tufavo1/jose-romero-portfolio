import { NextResponse } from "next/server";
import { readOverride, writeOverride } from "@/lib/admin-data";
import { validateCsrfRequest } from "@/lib/csrf";
import { experience } from "@/data/experience";

export async function GET() {
  const data = readOverride("experience", experience);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const csrf = await validateCsrfRequest(request);
  if (csrf) return csrf;

  const body = await request.json();
  writeOverride("experience", body);
  return NextResponse.json({ ok: true });
}
