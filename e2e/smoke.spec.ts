import { expect, test } from "@playwright/test";

test("the placeholder homepage renders the foundation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Lioua Zeddam/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "LIOUA ZEDDAM",
  );
  await expect(page.getByRole("main")).toBeVisible();
});

test("unknown routes render the 404", async ({ page }) => {
  const response = await page.goto("/no-such-route");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "404" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "→ back to the start" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "LIOUA ZEDDAM",
  );
});
