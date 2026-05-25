import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Hola, soy Jose Romero" }),
    ).toBeVisible();
  });

  test("navigates to projects page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Proyectos" }).first().click();
    await expect(page).toHaveURL("/projects");
    await expect(
      page.getByRole("heading", { name: "Proyectos", exact: true }),
    ).toBeVisible();
  });

  test("navigates to experience page", async ({ page }) => {
    await page.goto("/experience");
    await expect(
      page.getByRole("heading", { name: "Experiencia", exact: true }),
    ).toBeVisible();
  });

  test("navigates to about page", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "Sobre mí", exact: true }),
    ).toBeVisible();
  });

  test("navigates to contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: "Contacto", exact: true }),
    ).toBeVisible();
  });

  test("project detail page loads", async ({ page }) => {
    await page.goto("/projects/ractoryx-capture");
    await expect(
      page.getByRole("heading", { name: "Ractoryx Capture", exact: true }),
    ).toBeVisible();
  });
});
