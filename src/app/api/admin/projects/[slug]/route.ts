import { NextResponse } from "next/server";
import {
  getAdminProject,
  writeAdminProject,
  deleteAdminProject,
} from "@/lib/admin-data";
import type { ProjectFrontmatter } from "@/types/project";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = await getAdminProject(slug);
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { content, ...frontmatter } = await request.json();
  await writeAdminProject(
    slug,
    frontmatter as ProjectFrontmatter,
    content ?? "",
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await deleteAdminProject(slug);
  return NextResponse.json({ ok: true });
}
