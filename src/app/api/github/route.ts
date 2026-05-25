import { NextResponse } from "next/server";
import { getPinnedRepos } from "@/lib/github";

export const revalidate = 3600; // 1 hora

export async function GET() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "";
  const repos = await getPinnedRepos(username);
  return NextResponse.json(repos);
}
