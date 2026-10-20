import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page is responsive, accessible, and routes to signup", async ({
  page,
}, testInfo) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "A little room for your thoughts." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.screenshot({
    path: `output/playwright/landing-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Start your notebook" }).click();
  await expect(
    page.getByRole("heading", { name: "Make a little space." }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Email address" }),
  ).toBeVisible();
});

test("guest cannot open dashboard; password visibility and validation work", async ({
  page,
}) => {
  await page.goto("./dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email address").fill("reader@example.com");
  await page
    .getByLabel("Password", { exact: true })
    .fill("visible-then-hidden");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "password",
  );
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("unknown route offers a way home", async ({ page }) => {
  await page.goto("./missing-page");
  await expect(
    page.getByRole("heading", { name: "A page out of place." }),
  ).toBeVisible();
});
