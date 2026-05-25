import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateCsrfToken } from "@/lib/csrf";
import { checkLoginRateLimit } from "@/lib/rate-limit";

function makeSessionToken(pw: string) {
  return Buffer.from(pw + ":portfolio-admin").toString("base64");
}

const COOKIE_OPTS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";

  const { success } = await checkLoginRateLimit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const { email, password } = (await request.json()) as {
    email?: string;
    password: string;
  };

  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "changeme";

  const emailOk = expectedEmail === "" || email === expectedEmail;
  const passwordOk = password === expectedPassword;

  if (!emailOk || !passwordOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sessionToken = makeSessionToken(expectedPassword);
  const csrfToken = generateCsrfToken(expectedPassword);

  const cookieStore = await cookies();

  cookieStore.set("admin_session", sessionToken, {
    ...COOKIE_OPTS,
    httpOnly: true,
  });

  cookieStore.set("csrf_token", csrfToken, {
    ...COOKIE_OPTS,
    httpOnly: true,
  });

  cookieStore.set("csrf_public", csrfToken, {
    ...COOKIE_OPTS,
    httpOnly: false,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete("csrf_token");
  cookieStore.delete("csrf_public");
  return NextResponse.json({ ok: true });
}
