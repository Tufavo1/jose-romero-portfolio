import { NextResponse } from "next/server";
import { readProfile, writeProfile } from "@/lib/admin-data";
import { profile } from "@/data/profile";

export async function GET() {
  const data = (await readProfile()) ?? profile;
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeProfile(body);
  return NextResponse.json({ ok: true });
}
