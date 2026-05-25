import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  const routes = ["/", "/projects", "/experience", "/about", "/contact"];

  for (const route of routes) {
    test(`${route} has no critical accessibility violations`, async ({
      page,
    }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .exclude("#radix-")
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      if (critical.length > 0) {
        console.log(
          "Violations:",
          JSON.stringify(
            critical.map((v) => ({
              id: v.id,
              impact: v.impact,
              description: v.description,
              nodes: v.nodes.map((n) => n.target),
            })),
            null,
            2,
          ),
        );
      }

      expect(critical).toHaveLength(0);
    });
  }
});
