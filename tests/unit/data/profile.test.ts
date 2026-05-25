import { describe, it, expect } from "vitest";
import { profile } from "@/data/profile";

describe("profile data", () => {
  it("has required fields", () => {
    expect(profile.name).toBeTruthy();
    expect(profile.fullName).toBeTruthy();
    expect(profile.role).toBeTruthy();
    expect(profile.email).toBeTruthy();
    expect(profile.location).toBeTruthy();
  });

  it("has valid URLs", () => {
    expect(profile.urls.github).toMatch(/^https:\/\//);
    expect(profile.urls.linkedin).toMatch(/^https:\/\//);
  });

  it("has resume paths", () => {
    expect(profile.resume.es).toMatch(/\.pdf$/);
    expect(profile.resume.en).toMatch(/\.pdf$/);
  });
});
