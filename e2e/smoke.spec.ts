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

const SECTION_IDS = [
  "intro",
  "background",
  "principles",
  "work",
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
  await expect(page.getByText("400+").first()).toBeAttached();
  await expect(page.getByText(/the year it caught/i)).toBeAttached();
});

test("the site has no top header — the routes live in the hero chrome", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body > div > header")).toHaveCount(0);
  // The primary nav is the hero chrome's own — the same element set that later
  // becomes the rail. Exactly one nav, five routes.
  const nav = page.locator('[data-chrome] nav[aria-label="Primary"]');
  await expect(nav).toHaveCount(1);
  await expect(nav.getByRole("link")).toHaveCount(6);

  // It sits below the wordmark on load. (The nav wrapper is display:contents,
  // so measure the actual route list.)
  const [nameBottom, navTop] = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const list = document.querySelector(".hero-chrome-nav");
    if (!h1 || !list) return [0, 0];
    return [
      h1.getBoundingClientRect().bottom,
      list.getBoundingClientRect().top,
    ];
  });
  expect(navTop).toBeGreaterThanOrEqual(nameBottom - 40);
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

test("the hero name sits behind the portrait, its letters settling in", async ({
  page,
}) => {
  await page.goto("/");
  // The name is split into one span per letter for the fall-in.
  await expect(page.locator("[data-title-letter]")).toHaveCount(5);

  // z-order is the move: the portrait layer paints over the name.
  const z = await page.evaluate(() => {
    const name = document.querySelector('[data-hero="title"]');
    const portrait = document.querySelector("[data-portrait]");
    const layer = portrait?.parentElement?.parentElement ?? null;
    return {
      name: Number(getComputedStyle(name as Element).zIndex),
      portrait: Number(getComputedStyle(layer as Element).zIndex),
    };
  });
  expect(z.portrait).toBeGreaterThan(z.name);

  // After the entrance the letters rest at full size with no residual transform.
  await page.waitForTimeout(3400);
  const settled = await page.evaluate(() => {
    const first = document.querySelector("[data-title-letter]");
    if (!first) return null;
    return {
      opacity: Number(getComputedStyle(first).opacity),
      transform: getComputedStyle(first).transform,
    };
  });
  expect(settled?.opacity).toBeGreaterThan(0.98);
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(settled?.transform);
});

test("the hero chrome morphs into the side rail (one set of elements)", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(2600); // let the entrance finish

  const routes = page.locator('[data-chrome] nav[aria-label="Primary"] a');
  const panelAlpha = () =>
    page.evaluate(() =>
      Number(
        getComputedStyle(
          document.querySelector("[data-chrome-panel]") as Element,
        ).opacity,
      ),
    );

  // On load the rail panel is not shown (the chrome reads as the hero), and
  // there are six routes. (The data-state attribute stays "rail" throughout —
  // Flip drives the hero look via transforms, so panel opacity is the signal.)
  await expect(routes).toHaveCount(6);
  expect(await panelAlpha()).toBeLessThan(0.1);

  // Scroll through the pin: the panel forms as the shared items arrive.
  await wheelUntil(page, async () => (await panelAlpha()) > 0.9, {
    step: 400,
    max: 30,
  });
  expect(await panelAlpha()).toBeGreaterThan(0.9);

  // Crucially: it is the SAME six routes, not a duplicated second set.
  await expect(routes).toHaveCount(6);

  // Reversible: back at the top the panel recedes and the hero returns.
  await wheelUntil(page, async () => (await panelAlpha()) < 0.1, {
    step: -400,
    max: 30,
  });
  expect(await panelAlpha()).toBeLessThan(0.1);
});

test("work shows one project at a time and advances on scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  // Ride down until the Work section takes the screen.
  await wheelUntil(
    page,
    () =>
      page.evaluate(() => {
        const w = document.querySelector("#work");
        return !!w && w.getBoundingClientRect().top <= 2;
      }),
    { step: 600, max: 90 },
  );
  await page.waitForTimeout(400);

  // Assert on the focus state rather than raw opacity: the dim/brighten is a
  // 500ms transition, so mid-hand-over two cards legitimately read above any
  // opacity threshold. `data-active` is the deterministic signal.
  const activeCount = () =>
    page.locator('[data-work-card][data-active="true"]').count();
  const activeIndex = () =>
    page.evaluate(
      () =>
        document
          .querySelector('[data-work-card][data-active="true"]')
          ?.getAttribute("data-index") ?? null,
    );

  // Exactly one project is the focused one to begin with.
  expect(await activeCount()).toBe(1);
  const first = await activeIndex();

  // Scrolling inside the pin advances to a different project — still just one.
  await wheelUntil(page, async () => (await activeIndex()) !== first, {
    step: 350,
    max: 24,
  });
  expect(await activeIndex()).not.toBe(first);
  expect(await activeCount()).toBe(1);
});

test("the section navigation highlights the section you are in", async ({
  page,
}) => {
  await page.goto("/");
  const active = await wheelUntil(
    page,
    () =>
      page
        .locator('[data-rail-link="work"][data-active="true"]')
        .count()
        .then((n) => n === 1),
    { step: 600, max: 40 },
  );
  expect(active).toBe(true);
});

test("the hero chrome fits the viewport at laptop and desktop heights", async ({
  page,
}) => {
  // The hero is a pinned, fixed layer, so any part that falls outside the
  // viewport can never be scrolled to — it is simply lost.
  for (const [w, h] of [
    [1366, 768],
    [1440, 900],
    [1920, 1080],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await page.waitForTimeout(3200);

    const worst = await page.evaluate(() => {
      const sel = [
        "h1",
        ".hero-chrome-nav",
        ".hero-chrome-stats",
        ".hero-chrome-caps",
        ".hero-chrome-tagline",
      ];
      let over = 0;
      for (const s of sel) {
        const el = document.querySelector(s);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        over = Math.max(
          over,
          Math.round(r.bottom - window.innerHeight),
          -Math.round(r.top),
        );
      }
      return over;
    });
    expect(
      worst,
      `hero chrome overflows at ${String(w)}x${String(h)}`,
    ).toBeLessThanOrEqual(2);
  }
});

test("sections stay in order through a full scroll, and reveals keep working", async ({
  page,
}) => {
  // Regression: the hero pin used to be built after its neighbours, leaving
  // every later trigger measured against a document height that did not yet
  // include its spacer. Products fired over experience, and the triggers past
  // it never recovered.
  await page.goto("/");
  await page.waitForTimeout(2800);

  const tops = async () =>
    page.evaluate((ids) => {
      const out: Record<string, number> = {};
      for (const id of ids) {
        const el = document.querySelector(`#${id}`);
        out[id] = el ? Math.round(el.getBoundingClientRect().top) : NaN;
      }
      return out;
    }, SECTION_IDS);

  // Ride the whole page. At no point may a later section sit above an
  // earlier one on screen.
  for (let i = 0; i < 90; i++) {
    const t = await tops();
    for (let k = 1; k < SECTION_IDS.length; k++) {
      const prev = SECTION_IDS[k - 1] ?? "";
      const cur = SECTION_IDS[k] ?? "";
      expect(
        (t[cur] ?? 0) - (t[prev] ?? 0),
        `${cur} rose above ${prev} while scrolling`,
      ).toBeGreaterThan(-2);
    }
    const done = await page.evaluate(
      () =>
        window.scrollY >=
        document.documentElement.scrollHeight - window.innerHeight - 4,
    );
    if (done) break;
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(90);
  }

  // Motion still works at the far end of the page: the contact heading is
  // revealed, not stranded hidden by a trigger that never fired.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const el = document.querySelector("#contact form");
          return el ? parseFloat(getComputedStyle(el).opacity) : 0;
        }),
      { timeout: 8000 },
    )
    .toBeGreaterThan(0.9);
});

test("a rail link lands its section at the top and lights that route", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(2800);
  // Get past the hero so the rail is interactive.
  await wheelUntil(
    page,
    () =>
      page.evaluate(
        () =>
          Number(
            getComputedStyle(
              document.querySelector("[data-chrome-panel]") as Element,
            ).opacity,
          ) > 0.9,
      ),
    { step: 500, max: 30 },
  );

  await page.locator('[data-rail-link="background"]').click();
  await page.waitForTimeout(1800);

  const top = await page.evaluate(
    () =>
      document.querySelector("#background")?.getBoundingClientRect().top ?? 999,
  );
  expect(
    Math.abs(top),
    "section did not land at the top of the screen",
  ).toBeLessThan(8);

  // And the route that was clicked is the one marked current.
  await expect(
    page.locator('[data-rail-link][data-active="true"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-rail-link="background"][data-active="true"]'),
  ).toHaveCount(1);
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
  const beat = page.getByText(/the year it caught/i);
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
    // Nothing on the page plays on its own. The marquee is scroll-driven like
    // everything else, so with the scroll position untouched it must be
    // motionless — sampled after its scrub has settled onto the current
    // position, which is a one-off on load rather than a loop.
    const marqueeX = () =>
      page.evaluate(() => {
        const track = document.querySelector("[data-marquee-track]");
        if (!track) return 0;
        return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
      });
    await page.waitForTimeout(1500);
    const first = await marqueeX();
    await page.waitForTimeout(900);
    expect(await marqueeX()).toBe(first);

    // Content is still reachable and readable.
    const beat = page.getByText(/the year it caught/i);
    await beat.scrollIntoViewIfNeeded();
    await expect(beat).toBeVisible();
  });
});
