import { NextResponse } from "next/server";
import { readEducation, writeEducation } from "@/lib/admin-data";
import { education as defaultEducation } from "@/data/education";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { educationSchema } from "@/lib/validations";

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const data = await readEducation();
  return NextResponse.json(data.length > 0 ? data : defaultEducation);
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = educationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  await writeEducation(parsed.data);
  return NextResponse.json({ ok: true });
}
