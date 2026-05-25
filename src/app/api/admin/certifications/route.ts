import { NextResponse } from "next/server";
import { readCertifications, writeCertifications } from "@/lib/admin-data";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { certificationsSchema } from "@/lib/validations";

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const data = await readCertifications();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = certificationsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  await writeCertifications(parsed.data);
  return NextResponse.json({ ok: true });
}
