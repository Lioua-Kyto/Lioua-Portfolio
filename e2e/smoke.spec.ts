import { expect, test, type Page } from "@playwright/test";

/**
 * Scroll by wheel until `predicate` holds. Lenis owns the scroll position, so
 * `scrollIntoView`/`scrollTo` get animated back toward Lenis's own target and
 * land somewhere unintended — driving the wheel is the only honest way to move
 * the page the way a reader does.
 */
async function wheelUntil(
  page: Page,
  predicate: () => Promise<boolean>,
  { step = 400, max = 40 }: { step?: number; max?: number } = {},
): Promise<boolean> {
  for (let i = 0; i < max; i++) {
    if (await predicate()) return true;
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(120);
  }
  return predicate();
}

/** Distance a hero group has travelled from its settled position. */
async function heroTravel(page: Page, key: string): Promise<number> {
  return page.evaluate((k) => {
    const el = document.querySelector(`[data-hero="${k}"]`);
    if (!el) return 0;
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return Math.hypot(m.m41, m.m42);
  }, key);
}

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

test("the site has no top header — the routes live under the name", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body > div > header")).toHaveCount(0);
  // The primary nav sits inside the hero, beneath the giant name.
  const nav = page.locator('#intro nav[aria-label="Primary"]');
  await expect(nav).toBeAttached();
  await expect(nav.getByRole("link")).toHaveCount(6);

  const [nameBottom, navTop] = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const nav = document.querySelector('#intro nav[aria-label="Primary"]');
    if (!h1 || !nav) return [0, 0];
    return [h1.getBoundingClientRect().bottom, nav.getBoundingClientRect().top];
  });
  expect(navTop).toBeGreaterThanOrEqual(nameBottom - 1);
});

test("no motion toggle remains anywhere on the page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("button[aria-pressed]")).toHaveCount(0);
  await expect(page.getByText(/motion: (on|off)/i)).toHaveCount(0);
});

test("smooth scroll runs regardless of the OS motion setting", async ({
  page,
}) => {
  await page.goto("/");
  // Lenis smooths native scroll rather than hijacking it, so it stays on.
  await expect(page.locator("html")).toHaveClass(/lenis/);
});

test("the hero entrance lands the title first, then the rest", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "commit" });

  const titleOffset = async () =>
    page.evaluate(() => {
      const word = document.querySelector("[data-hero-word]");
      if (!word) return null;
      const m = new DOMMatrixReadOnly(getComputedStyle(word).transform);
      return m.m42;
    });

  // It rises into place from below its mask, and gets there.
  await expect.poll(titleOffset, { timeout: 8000 }).toBeLessThan(1);

  // Everything else has arrived by the end of the entrance.
  for (const key of ["nav", "stats", "lede", "capabilities", "tagline"]) {
    await expect
      .poll(
        () =>
          page.evaluate((k) => {
            const el = document.querySelector(`[data-hero="${k}"]`);
            return el ? parseFloat(getComputedStyle(el).opacity) : 0;
          }, key),
        { timeout: 8000 },
      )
      .toBeGreaterThan(0.9);
  }
});

test("the title leads the entrance — the rest follow behind it", async ({
  page,
}) => {
  // Record the entrance from inside the page, on rAF, starting before any app
  // script runs. Polling from the test process cannot reliably catch a
  // sub-100ms window; this captures the whole sequence and asserts its order.
  await page.addInitScript(() => {
    const w = window as unknown as { __firstMove: Record<string, number> };
    w.__firstMove = {};
    let armed = false;
    let start = 0;
    const tick = () => {
      const word = document.querySelector("[data-hero-word]");
      const y = word
        ? new DOMMatrixReadOnly(getComputedStyle(word).transform).m42
        : 0;

      // Before hydration the elements sit at their natural CSS values, which
      // look identical to "finished". Only start the clock once GSAP has
      // pushed the title down behind its mask — that is the entrance arming.
      if (!armed) {
        if (y > 20) {
          armed = true;
          start = performance.now();
        }
        requestAnimationFrame(tick);
        return;
      }

      const record = (key: string, settled: boolean) => {
        if (settled && !(key in w.__firstMove)) {
          w.__firstMove[key] = performance.now() - start;
        }
      };
      record("title", y < 4);
      for (const key of ["nav", "stats", "lede", "capabilities", "tagline"]) {
        const el = document.querySelector(`[data-hero="${key}"]`);
        if (el) record(key, parseFloat(getComputedStyle(el).opacity) > 0.98);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  await page.goto("/");
  await page.waitForTimeout(3200);

  const marks = await page.evaluate(
    () =>
      (window as unknown as { __firstMove: Record<string, number> })
        .__firstMove,
  );

  // Everything arrived...
  for (const key of [
    "title",
    "nav",
    "stats",
    "lede",
    "capabilities",
    "tagline",
  ]) {
    expect(marks[key], `${key} never settled`).toBeDefined();
  }
  // ...and the title got there before the supporting matter did.
  const title = marks.title ?? 0;
  for (const key of ["stats", "lede", "capabilities", "tagline"]) {
    expect(marks[key], `${key} should settle after the title`).toBeGreaterThan(
      title,
    );
  }
});

test("the hero pins, disperses its parts, and hands off to the rail", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(2600); // let the entrance finish

  const rail = page.locator("aside[aria-label='Section navigation']");
  const railOpacity = async () =>
    Number(await rail.evaluate((el) => getComputedStyle(el).opacity));
  const heroOpacity = async (key: string) =>
    page.evaluate((k) => {
      const el = document.querySelector(`[data-hero="${k}"]`);
      return el ? parseFloat(getComputedStyle(el).opacity) : 1;
    }, key);

  expect(await railOpacity()).toBeLessThan(0.1);

  // The hero is pinned: it stays put on screen while the scroll is consumed.
  const introTopBefore = await page.evaluate(
    () => document.querySelector("#intro")?.getBoundingClientRect().top ?? 0,
  );
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  const introTopAfter = await page.evaluate(
    () => document.querySelector("#intro")?.getBoundingClientRect().top ?? 0,
  );
  expect(Math.abs(introTopAfter - introTopBefore)).toBeLessThan(4);

  // The groups disperse at different speeds — the footnote outruns the title.
  expect(await heroTravel(page, "tagline")).toBeGreaterThan(
    await heroTravel(page, "title"),
  );

  // Past the pin the rail has taken over.
  await wheelUntil(page, async () => (await railOpacity()) > 0.9);
  expect(await railOpacity()).toBeGreaterThan(0.9);

  // Reversible: wheeling back retreats the rail and returns the hero.
  await wheelUntil(page, async () => (await railOpacity()) < 0.1, {
    step: -400,
  });
  expect(await railOpacity()).toBeLessThan(0.1);
  await expect
    .poll(() => heroOpacity("title"), { timeout: 6000 })
    .toBeGreaterThan(0.9);
});

test("the projects rail pins and travels sideways, then releases", async ({
  page,
}) => {
  await page.goto("/");
  const trackX = () =>
    page.evaluate(() => {
      const track = document.querySelector("[data-rail-track]");
      if (!track) return 0;
      return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    });

  // Ride down to where the products section takes the screen.
  const productsTop = async () =>
    page.evaluate(
      () =>
        document.querySelector("#products")?.getBoundingClientRect().top ?? 1e6,
    );
  const reached = await wheelUntil(
    page,
    async () => (await productsTop()) <= 2,
    { step: 600, max: 60 },
  );
  expect(reached).toBe(true);
  const start = await trackX();

  // Scrolling inside the pin pulls the track left rather than moving the page.
  await wheelUntil(page, async () => (await trackX()) < start - 50, {
    step: 400,
    max: 12,
  });
  expect(await trackX()).toBeLessThan(start - 50);

  // And it releases: the section after the rail becomes reachable.
  const released = await wheelUntil(
    page,
    async () =>
      page.evaluate(() => {
        const t = document.querySelector("#toolkit");
        return !!t && t.getBoundingClientRect().top < window.innerHeight;
      }),
    { step: 600, max: 40 },
  );
  expect(released).toBe(true);
});

test("the section navigation highlights the section you are in", async ({
  page,
}) => {
  await page.goto("/");
  const active = await wheelUntil(
    page,
    () =>
      page
        .locator('[data-rail-link="experience"][data-active="true"]')
        .count()
        .then((n) => n === 1),
    { step: 600, max: 40 },
  );
  expect(active).toBe(true);
});

test("the hero fits the viewport at laptop and desktop heights", async ({
  page,
}) => {
  // The hero is pinned, so anything taller than the viewport can never be
  // scrolled into view — it is simply lost.
  for (const [w, h] of [
    [1366, 768],
    [1440, 900],
    [1920, 1080],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await page.waitForTimeout(3200);

    const overflow = await page.evaluate(() => {
      const hero = document.querySelector("#intro");
      if (!hero) return 0;
      return Math.round(
        hero.getBoundingClientRect().height - window.innerHeight,
      );
    });
    expect(
      overflow,
      `hero overflows at ${String(w)}x${String(h)}`,
    ).toBeLessThanOrEqual(1);

    // And the last thing in — the footnote — is actually on screen.
    const taglineVisible = await page.evaluate(() => {
      const el = document.querySelector('[data-hero="tagline"]');
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.bottom <= window.innerHeight + 1 && r.top >= 0;
    });
    expect(
      taglineVisible,
      `tagline off screen at ${String(w)}x${String(h)}`,
    ).toBe(true);
  }
});

test("no scrollbar chrome is rendered", async ({ page }) => {
  await page.goto("/");
  const gutter = await page.evaluate(
    () => window.innerWidth - document.documentElement.clientWidth,
  );
  expect(gutter).toBe(0);
});

test("section reveals start hidden and play in on scroll", async ({ page }) => {
  await page.goto("/");
  const beat = page.getByText(/first real client, first real panic/i);
  // Below the fold: hidden by the reveal set until scrolled into view.
  await expect(beat).toBeHidden();
  await beat.scrollIntoViewIfNeeded();
  await expect(beat).toBeVisible();
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

  test("stills the autoplaying loops but keeps the page navigable", async ({
    page,
  }) => {
    await page.goto("/");
    // The marquee is the one thing that moves without being asked to; under
    // reduced motion it holds still.
    const marqueeX = () =>
      page.evaluate(() => {
        const track = document.querySelector("[data-marquee-track]");
        if (!track) return 0;
        return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
      });
    const first = await marqueeX();
    await page.waitForTimeout(900);
    expect(await marqueeX()).toBe(first);

    // Content is still reachable and readable.
    const beat = page.getByText(/first real client, first real panic/i);
    await beat.scrollIntoViewIfNeeded();
    await expect(beat).toBeVisible();
  });
});
