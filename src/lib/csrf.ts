import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function generateCsrfToken(secret: string): string {
  const random = crypto.randomBytes(32).toString("hex");
  const hmac = crypto.createHmac("sha256", secret).update(random).digest("hex");
  return `${random}.${hmac}`;
}

function verifyCsrfSignature(token: string, secret: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const random = token.slice(0, dot);
  const hmac = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(random)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmac, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

export async function validateCsrfRequest(
  request: Request,
): Promise<NextResponse | null> {
  const headerToken = request.headers.get("x-csrf-token");
  if (!headerToken) {
    return NextResponse.json({ error: "Missing CSRF token" }, { status: 403 });
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("csrf_token")?.value;
  if (!cookieToken) {
    return NextResponse.json({ error: "Invalid session" }, { status: 403 });
  }

  let match = false;
  try {
    if (headerToken.length === cookieToken.length) {
      match = crypto.timingSafeEqual(
        Buffer.from(headerToken),
        Buffer.from(cookieToken),
      );
    }
  } catch {
    match = false;
  }

  if (!match) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const secret = process.env.ADMIN_PASSWORD ?? "changeme";
  if (!verifyCsrfSignature(cookieToken, secret)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  return null;
}
