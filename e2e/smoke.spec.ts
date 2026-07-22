import { expect, test } from "@playwright/test";

test("the placeholder homepage renders the foundation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Lioua Zeddam/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "LIOUA ZEDDAM",
  );
  await expect(page.getByRole("main")).toBeVisible();
});

test("gsap animations settle and survive route changes cleanly", async ({
  page,
}) => {
  // Motion spec §1: no ghost animations across App Router navigations.
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/no-such-route");
  // Client-side navigate home → hero mounts and its timeline runs.
  await page.getByRole("link", { name: "→ back to the start" }).click();
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("LIOUA ZEDDAM");
  // The intro timeline must settle at full opacity, no residual transform.
  await expect(heading).toHaveCSS("opacity", "1");
  // Unmount (back) and remount (forward) — cleanup must not throw or leak.
  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "404" }),
  ).toBeVisible();
  await page.goForward();
  await expect(heading).toHaveText("LIOUA ZEDDAM");
  await expect(heading).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
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
