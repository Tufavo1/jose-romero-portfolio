import { NextResponse } from "next/server";
import { readExperience, writeExperience } from "@/lib/admin-data";
import { experience as defaultExperience } from "@/data/experience";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { experienceSchema } from "@/lib/validations";

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const data = await readExperience();
  return NextResponse.json(data.length > 0 ? data : defaultExperience);
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = experienceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  await writeExperience(parsed.data);
  return NextResponse.json({ ok: true });
}
