import { NextResponse } from "next/server";
import { listAdminProjects, writeAdminProject } from "@/lib/admin-data";
import type { ProjectFrontmatter } from "@/types/project";

export async function GET() {
  const projects = await listAdminProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const { slug, content, ...frontmatter } = await request.json();

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  await writeAdminProject(
    slug,
    frontmatter as ProjectFrontmatter,
    content ?? "",
  );
  return NextResponse.json({ ok: true, slug });
}
