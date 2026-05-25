import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { readContactSettings } from "@/lib/admin-data";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const settings = await readContactSettings();
    if (!settings.form_enabled) {
      return NextResponse.json(
        { error: "El formulario de contacto está desactivado." },
        { status: 403 },
      );
    }

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
          issues: parsed.error.flatten((i) => i.message).fieldErrors,
        },
        { status: 400 },
      );
    }

    const sanitized = {
      ...parsed.data,
      name: stripHtml(parsed.data.name),
      message: stripHtml(parsed.data.message),
    };

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Contact form unavailable" },
        { status: 503 },
      );
    }

    await sendContactEmail(sanitized);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Error interno. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
