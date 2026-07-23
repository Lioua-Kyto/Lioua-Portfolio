import { expect, test } from "@playwright/test";

const SECTION_IDS = [
  "intro",
  "background",
  "principles",
  "experience",
  "products",
  "toolkit",
  "contact",
];

test("the six numbered sections render as one semantic document", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Lioua Zeddam/);
  // The giant name splits into masked lines; aria-label carries the full name.
  await expect(
    page.getByRole("heading", { level: 1, name: "Lioua Zeddam" }),
  ).toBeAttached();
  await expect(page.getByRole("main")).toBeVisible();
  for (const id of SECTION_IDS) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  // Real content, not filler: a proof number and a timeline beat.
  await expect(page.getByText("176ms → 38ms").first()).toBeAttached();
  await expect(
    page.getByText(/first real client, first real panic/i),
  ).toBeAttached();
});

test("gsap hero timeline settles and survives route changes cleanly", async ({
  page,
}) => {
  // Motion spec §1: no ghost animations across App Router navigations.
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/no-such-route");
  await page.getByRole("link", { name: "→ back to the start" }).click();
  const heading = page.getByRole("heading", { level: 1, name: "Lioua Zeddam" });
  await expect(heading).toBeAttached();
  await expect(heading).toHaveCSS("opacity", "1");
  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "404" }),
  ).toBeVisible();
  await page.goForward();
  await expect(heading).toBeAttached();
  await expect(heading).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

test("section reveals start hidden and play in on scroll", async ({ page }) => {
  await page.goto("/");
  const beat = page.getByText(/first real client, first real panic/i);
  // Below the fold: hidden by the reveal set until scrolled into view.
  await expect(beat).toBeHidden();
  await beat.scrollIntoViewIfNeeded();
  await expect(beat).toBeVisible();
});

test("the side rail displaces in past the hero and reverses back", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(600);
  // CSS locator, not getByRole: while hidden the rail leaves the a11y tree.
  const rail = page.locator('aside[aria-label="Section navigation"]');
  const opacity = async () =>
    Number(await rail.evaluate((el) => getComputedStyle(el).opacity));

  // Hidden while the hero owns the screen.
  expect(await opacity()).toBeLessThan(0.1);

  await page.evaluate(() => {
    document.querySelector("#experience")?.scrollIntoView();
  });
  await expect.poll(opacity, { timeout: 5000 }).toBeGreaterThan(0.9);

  // Reversible: back at the hero it retreats again (no reload needed).
  await page.evaluate(() => {
    document.querySelector("#intro")?.scrollIntoView();
  });
  await expect.poll(opacity, { timeout: 5000 }).toBeLessThan(0.1);
});

test("the contact form is present and labeled", async ({ page }) => {
  await page.goto("/#contact");
  const form = page.locator("#contact form");
  await form.scrollIntoViewIfNeeded();
  await expect(form.getByLabel("name")).toBeVisible();
  await expect(form.getByLabel("email")).toBeVisible();
  await expect(form.getByLabel("message")).toBeVisible();
  await expect(form.getByRole("button", { name: "Send" })).toBeVisible();
});

test("unknown routes render the 404", async ({ page }) => {
  const response = await page.goto("/no-such-route");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "404" }),
  ).toBeVisible();
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("fades content in with no movement and no smooth scroll", async ({
    page,
  }) => {
    await page.goto("/");
    // The hero is never hidden, and no Lenis smooth scroll is attached.
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.locator("html")).not.toHaveClass(/lenis/);

    // Below-fold content fades in on approach — opacity only, never a
    // transform (motion spec §6: no travel under reduced motion).
    const beat = page.getByText(/first real client, first real panic/i);
    await beat.scrollIntoViewIfNeeded();
    await expect(beat).toBeVisible();
    const transform = await beat.evaluate(
      (el) => getComputedStyle(el).transform,
    );
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
  });
});
