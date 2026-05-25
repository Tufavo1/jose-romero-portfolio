import { NextResponse } from "next/server";
import { readCertifications, writeCertifications } from "@/lib/admin-data";

export async function GET() {
  const data = await readCertifications();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeCertifications(body);
  return NextResponse.json({ ok: true });
}
