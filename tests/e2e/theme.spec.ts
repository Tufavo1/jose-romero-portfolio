import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("toggles between dark and light mode", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("class", /dark/);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(html).not.toHaveAttribute("class", /dark/);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(html).toHaveAttribute("class", /dark/);
  });
});
