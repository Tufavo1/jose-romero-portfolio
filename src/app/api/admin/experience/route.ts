import { NextResponse } from "next/server";
import { readExperience, writeExperience } from "@/lib/admin-data";
import { experience as defaultExperience } from "@/data/experience";

export async function GET() {
  const data = await readExperience();
  return NextResponse.json(data.length > 0 ? data : defaultExperience);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeExperience(body);
  return NextResponse.json({ ok: true });
}
