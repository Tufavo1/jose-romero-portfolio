import { NextResponse } from "next/server";
import { readEducation, writeEducation } from "@/lib/admin-data";
import { education as defaultEducation } from "@/data/education";

export async function GET() {
  const data = await readEducation();
  return NextResponse.json(data.length > 0 ? data : defaultEducation);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeEducation(body);
  return NextResponse.json({ ok: true });
}
