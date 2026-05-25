import { describe, it, expect } from "vitest";
import { skills } from "@/data/skills";

describe("skills data", () => {
  it("has at least one skill", () => {
    expect(skills.length).toBeGreaterThan(0);
  });

  it("every skill has required fields", () => {
    for (const skill of skills) {
      expect(skill.name).toBeTruthy();
      expect(skill.category).toBeTruthy();
      expect(["beginner", "intermediate", "advanced"]).toContain(skill.level);
    }
  });

  it("has skills in multiple categories", () => {
    const categories = new Set(skills.map((s) => s.category));
    expect(categories.size).toBeGreaterThan(2);
  });
});
