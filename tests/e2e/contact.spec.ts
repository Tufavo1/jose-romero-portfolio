import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(
      page.getByText("El nombre debe tener al menos 2 caracteres"),
    ).toBeVisible();
  });

  test("shows email validation error", async ({ page }) => {
    await page.getByPlaceholder("Tu nombre").fill("Jose Romero");
    await page.getByPlaceholder("tu@email.com").fill("not-an-email");
    await page
      .getByPlaceholder("¿En qué puedo ayudarte?")
      .fill("Mensaje de prueba largo suficiente.");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(page.getByText("Email inválido")).toBeVisible();
  });

  test("form fields are accessible", async ({ page }) => {
    await expect(page.getByPlaceholder("Tu nombre")).toBeVisible();
    await expect(page.getByPlaceholder("tu@email.com")).toBeVisible();
    await expect(
      page.getByPlaceholder("¿En qué puedo ayudarte?"),
    ).toBeVisible();
  });
});
