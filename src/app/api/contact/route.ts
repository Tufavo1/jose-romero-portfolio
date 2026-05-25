import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

    const { success, remaining } = await checkRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta de nuevo en 1 hora." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": String(remaining) },
        },
      );
    }

    const body: unknown = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await sendContactEmail(parsed.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Error interno. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
