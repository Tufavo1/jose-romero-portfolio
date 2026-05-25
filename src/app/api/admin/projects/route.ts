import { NextResponse } from "next/server";
import { listAdminProjects, writeAdminProject } from "@/lib/admin-data";
import type { ProjectFrontmatter } from "@/types/project";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { projectPostSchema } from "@/lib/validations";

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "login",
  "logout",
  "auth",
  "dashboard",
  "static",
  "_next",
  "favicon",
  "robots",
  "sitemap",
  "manifest",
  "about",
  "contact",
  "experience",
  "projects",
]);

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const projects = await listAdminProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = projectPostSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { slug, content, ...frontmatter } = parsed.data;

  if (RESERVED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Slug is reserved" }, { status: 400 });
  }

  await writeAdminProject(
    slug,
    frontmatter as unknown as ProjectFrontmatter,
    content ?? "",
  );
  return NextResponse.json({ ok: true, slug });
}
