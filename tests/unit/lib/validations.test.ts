import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validations";

describe("contactSchema", () => {
  it("validates a correct payload", () => {
    const result = contactSchema.safeParse({
      name: "Jose Romero",
      email: "jose@example.com",
      message: "Hola, me interesa contactarte.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name that is too short", () => {
    const result = contactSchema.safeParse({
      name: "J",
      email: "jose@example.com",
      message: "Mensaje válido aquí.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Jose Romero",
      email: "not-an-email",
      message: "Mensaje válido aquí.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a message that is too short", () => {
    const result = contactSchema.safeParse({
      name: "Jose Romero",
      email: "jose@example.com",
      message: "Corto",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toBeDefined();
    }
  });

  it("rejects a message that exceeds max length", () => {
    const result = contactSchema.safeParse({
      name: "Jose Romero",
      email: "jose@example.com",
      message: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});
