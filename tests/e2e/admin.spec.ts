import { test, expect } from "@playwright/test";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "changeme";

test.describe("admin auth", () => {
  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByPlaceholder("Correo electrónico").fill("test@example.com");
    await page.getByPlaceholder("Contraseña").fill("definitelyn0tright");

    // Wait for button to be enabled (React state settled)
    const button = page.getByRole("button", { name: /entrar/i });
    await expect(button).not.toBeDisabled();

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/admin/auth")),
      button.click(),
    ]);

    // Auth must fail (wrong password → 401, or rate-limited → 429)
    expect([401, 429]).toContain(response.status());
    // Either error message is acceptable
    await expect(page.locator("p.text-red-500")).toBeVisible();
  });

  test("login with correct password redirects to /admin", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByPlaceholder("Correo electrónico").fill("admin@example.com");
    await page.getByPlaceholder("Contraseña").fill(ADMIN_PASSWORD);

    const button = page.getByRole("button", { name: /entrar/i });
    await expect(button).not.toBeDisabled();
    await button.click();

    await page.waitForURL(/\/admin($|\/)/, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/admin($|\/)/);
  });

  test("/admin redirects to /admin/login when not authenticated", async ({
    request,
  }) => {
    // APIRequestContext follows redirects; the final URL should be /admin/login
    const res = await request.get("/admin/home");
    expect(res.url()).toContain("/admin/login");
  });
});
