import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("real account registration, CRUD, search, persistence and logout", async ({
  page,
}, testInfo) => {
  test.skip(
    process.env.E2E_LIVE !== "1",
    "Set E2E_LIVE=1 against an explicitly disposable evaluation project.",
  );
  const unique = `${Date.now()}-${testInfo.project.name}`;
  const email = `stillnote-e2e-${unique}@example.com`;
  const password = `Test!${crypto.randomUUID()}`;
  await page.goto("./signup");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30000 });
  await expect(
    page.getByRole("heading", { name: "A fresh page, just for you." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Write your first note" }).click();
  await page.getByLabel("Note title").fill(`The quiet idea ${unique}`);
  await page
    .getByLabel("Note content")
    .fill(
      "Make time for the things that make you feel like you.\n<script>window.unwanted = true</script>",
    );
  await page.getByRole("radio", { name: "sage", exact: true }).check();
  await page.getByRole("button", { name: "Pin note", exact: true }).click();
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: `The quiet idea ${unique}` }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: `The quiet idea ${unique}` }),
  ).toBeVisible();
  expect(await page.evaluate(() => Object.hasOwn(window, "unwanted"))).toBe(
    false,
  );
  await page.getByLabel("Search notes").fill("not-in-this-note");
  await expect(
    page.getByRole("heading", {
      name: "That thought is playing hide-and-seek.",
    }),
  ).toBeVisible();
  await page.getByLabel("Search notes").fill("quiet");
  await page
    .getByRole("button", { name: `Edit The quiet idea ${unique}`, exact: true })
    .click();
  await page.getByLabel("Note title").fill(`A better idea ${unique}`);
  await page
    .getByLabel("Note content")
    .fill("A small beginning is still a beginning.");
  await page.getByRole("button", { name: "Close editor" }).click();
  await expect(
    page.getByText("You have unsaved changes. Leave this note?"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep writing" }).click();
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByLabel("Search notes").fill("");
  await expect(
    page.getByRole("heading", { name: `A better idea ${unique}` }),
  ).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `output/playwright/dashboard-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: `Delete A better idea ${unique}` })
    .click();
  await page.getByRole("button", { name: "Keep note", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: `A better idea ${unique}` }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: `Delete A better idea ${unique}` })
    .click();
  await page.getByRole("button", { name: "Delete note", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A fresh page, just for you." }),
  ).toBeVisible();
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Open my notebook" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "A fresh page, just for you." }),
  ).toBeVisible();
});
