import { NextResponse } from "next/server";
import { listAdminProjects, writeAdminProject } from "@/lib/admin-data";
import { validateCsrfRequest } from "@/lib/csrf";
import type { ProjectFrontmatter } from "@/types/project";

export async function GET() {
  const projects = listAdminProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const csrf = await validateCsrfRequest(request);
  if (csrf) return csrf;

  const { slug, content, ...frontmatter } = (await request.json()) as {
    slug: string;
    content?: string;
  } & ProjectFrontmatter;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  writeAdminProject(slug, frontmatter as ProjectFrontmatter, content ?? "");
  return NextResponse.json({ ok: true, slug });
}
