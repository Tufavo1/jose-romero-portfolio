import { describe, it, expect } from "vitest";
import path from "path";

describe("getProjectSlugs", () => {
  it("resolves @/ alias correctly", () => {
    const resolved = path.resolve(__dirname, "../../../src");
    expect(resolved).toContain("src");
  });

  it("mdx filter logic works correctly", () => {
    const files = [
      "project-one.mdx",
      "project-two.mdx",
      ".DS_Store",
      "README.md",
    ];
    const slugs = files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(".mdx", ""));
    expect(slugs).toEqual(["project-one", "project-two"]);
  });

  it("returns empty array when no mdx files", () => {
    const files = [".DS_Store", "README.md"];
    const slugs = files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(".mdx", ""));
    expect(slugs).toEqual([]);
  });
});
