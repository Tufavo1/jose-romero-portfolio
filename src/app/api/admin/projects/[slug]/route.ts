import { NextResponse } from "next/server";
import {
  getAdminProject,
  writeAdminProject,
  deleteAdminProject,
} from "@/lib/admin-data";
import type { ProjectFrontmatter } from "@/types/project";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { projectFrontmatterSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await verifyAdminSession();
  if (authError) return authError;

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
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = projectFrontmatterSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { slug } = await params;
  const { content, ...frontmatter } = parsed.data;

  await writeAdminProject(
    slug,
    frontmatter as unknown as ProjectFrontmatter,
    content ?? "",
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const { slug } = await params;
  await deleteAdminProject(slug);
  return NextResponse.json({ ok: true });
}
