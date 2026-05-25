import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function makeSessionToken(password: string): string {
  return crypto
    .createHmac("sha256", password)
    .update("admin-session-v1")
    .digest("hex");
}

export async function verifyAdminSession(): Promise<NextResponse | null> {
  const secret = process.env.ADMIN_PASSWORD ?? "changeme";
  const expected = makeSessionToken(secret);

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  let valid = false;
  try {
    if (token && token.length === expected.length) {
      valid = crypto.timingSafeEqual(
        Buffer.from(token, "hex"),
        Buffer.from(expected, "hex"),
      );
    }
  } catch {
    valid = false;
  }

  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
