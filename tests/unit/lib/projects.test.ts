import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "@/lib/supabase";
import {
  getProjectSlugs,
  getProjectBySlug,
  getAllProjects,
} from "@/lib/projects";

const mockFrom = supabase.from as ReturnType<typeof vi.fn>;

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {};
  const methods = ["select", "order", "eq", "single"];
  for (const m of methods) {
    chain[m] = vi.fn(() => chain);
  }
  chain["single"] = vi.fn(() => Promise.resolve(result));
  chain["order"] = vi.fn(() => Promise.resolve(result));
  chain["eq"] = vi.fn(() => chain);
  chain["select"] = vi.fn(() => chain);
  return chain;
}

describe("slug generation", () => {
  it("derives slug by stripping .mdx extension", () => {
    const files = ["my-project.mdx", "another-one.mdx"];
    const slugs = files.map((f) => f.replace(/\.mdx$/, ""));
    expect(slugs).toEqual(["my-project", "another-one"]);
  });

  it("returns empty array when no files", () => {
    const files: string[] = [];
    const slugs = files.map((f) => f.replace(/\.mdx$/, ""));
    expect(slugs).toEqual([]);
  });

  it("filters non-mdx files correctly", () => {
    const files = ["a.mdx", ".DS_Store", "README.md", "b.mdx"];
    const slugs = files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
    expect(slugs).toEqual(["a", "b"]);
  });
});

describe("frontmatter mapping", () => {
  it("maps frontmatter fields onto project object", () => {
    const frontmatter = {
      title: "Test Project",
      description: "A project",
      date: "2024-01-01",
      tags: ["react", "typescript"],
      featured: true,
      status: "completed" as const,
    };
    const slug = "test-project";
    const project = { ...frontmatter, slug, url: `/projects/${slug}` };

    expect(project.title).toBe("Test Project");
    expect(project.slug).toBe("test-project");
    expect(project.url).toBe("/projects/test-project");
    expect(project.tags).toContain("react");
    expect(project.featured).toBe(true);
  });

  it("constructs url from slug", () => {
    const slug = "my-cool-project";
    const url = `/projects/${slug}`;
    expect(url).toBe("/projects/my-cool-project");
  });

  it("handles optional fields absent from frontmatter", () => {
    const frontmatter = {
      title: "Minimal",
      description: "desc",
      date: "2024-01-01",
      tags: [],
      featured: false,
      status: "archived" as const,
      githubUrl: undefined,
      liveUrl: undefined,
    };
    expect(frontmatter.githubUrl).toBeUndefined();
    expect(frontmatter.liveUrl).toBeUndefined();
  });
});

describe("getProjectSlugs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns slugs from supabase rows", async () => {
    const chain = makeChain({ data: [{ slug: "alpha" }, { slug: "beta" }] });
    mockFrom.mockReturnValue(chain);

    const slugs = await getProjectSlugs();
    expect(slugs).toEqual(["alpha", "beta"]);
  });

  it("returns empty array when supabase returns no data", async () => {
    const chain = makeChain({ data: null });
    mockFrom.mockReturnValue(chain);

    const slugs = await getProjectSlugs();
    expect(slugs).toEqual([]);
  });
});

describe("getProjectBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns project with merged frontmatter", async () => {
    const frontmatter = {
      title: "Alpha",
      description: "desc",
      date: "2024-01-01",
      tags: ["ts"],
      featured: false,
      status: "completed",
    };
    const chain = makeChain({
      data: { slug: "alpha", frontmatter, content: "# Hello" },
    });
    mockFrom.mockReturnValue(chain);

    const project = await getProjectBySlug("alpha");
    expect(project.title).toBe("Alpha");
    expect(project.slug).toBe("alpha");
    expect(project.content).toBe("# Hello");
    expect(project.url).toBe("/projects/alpha");
  });

  it("throws when project not found", async () => {
    const chain = makeChain({ data: null });
    mockFrom.mockReturnValue(chain);

    await expect(getProjectBySlug("missing")).rejects.toThrow(
      "Project not found: missing",
    );
  });
});

describe("getAllProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps all rows to project objects", async () => {
    const rows = [
      {
        slug: "a",
        frontmatter: {
          title: "A",
          description: "",
          date: "2024-01-01",
          tags: [],
          featured: false,
          status: "completed",
        },
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        slug: "b",
        frontmatter: {
          title: "B",
          description: "",
          date: "2024-01-02",
          tags: [],
          featured: true,
          status: "in-progress",
        },
        updated_at: "2024-01-02T00:00:00Z",
      },
    ];
    const chain = makeChain({ data: rows });
    mockFrom.mockReturnValue(chain);

    const projects = await getAllProjects();
    expect(projects).toHaveLength(2);
    expect(projects[0]!.slug).toBe("a");
    expect(projects[1]!.slug).toBe("b");
    expect(projects[1]!.url).toBe("/projects/b");
  });

  it("returns empty array when supabase returns null", async () => {
    const chain = makeChain({ data: null });
    mockFrom.mockReturnValue(chain);

    const projects = await getAllProjects();
    expect(projects).toEqual([]);
  });
});
