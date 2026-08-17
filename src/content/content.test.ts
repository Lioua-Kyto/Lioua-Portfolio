import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contentSchema } from "./schemas";
import { rawContent } from "./data";
import { content } from "./index";

describe("content", () => {
  it("passes full schema validation", () => {
    expect(() => contentSchema.parse(rawContent)).not.toThrow();
  });

  it("merges client work and products into one list with unique slugs", () => {
    const slugs = content.work.map((w) => w.slug);
    expect(slugs).toEqual([
      "brewphoria",
      "rezervitoo",
      "faderco",
      "fitguild",
      "praxisos",
    ]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps the résumé's real headline metric intact (never invented)", () => {
    const rezervitoo = content.work.find((w) => w.slug === "rezervitoo");
    expect(rezervitoo?.metric?.value).toBe("~40ms");
  });

  it("uses the résumé's contact email", () => {
    expect(content.contact.email).toBe("liwaazeddam@gmail.com");
  });
});

/**
 * A wrong path to a file in `public/` is invisible to TypeScript and to the
 * build: the page renders, the image box stays empty, the download 404s, and
 * nothing anywhere goes red. Both have now happened once — a project's whole
 * gallery pointed at deleted files, and the résumé href stopped matching the
 * file after it was re-uploaded under a different name. Case matters on the
 * deployment host even when it does not locally, so this checks the literal
 * string against the literal filename.
 */
describe("public assets referenced by the site exist", () => {
  const publicPath = (url: string) => join(process.cwd(), "public", url);

  it("every project cover and capture resolves", () => {
    const missing = content.work.flatMap((item) =>
      [item.cover?.src, ...item.gallery.map((s) => s.src)]
        .filter((src): src is string => !!src)
        .filter((src) => !existsSync(publicPath(src))),
    );
    expect(missing).toEqual([]);
  });

  it("the résumé the rail offers is actually there", () => {
    // Read the href out of the component rather than restating it here, so
    // this fails when the link changes and the file does not, or vice versa.
    const chrome = readFileSync(
      join(process.cwd(), "src/components/hero/HeroChrome.tsx"),
      "utf8",
    );
    const href = /href="(\/[^"]+\.pdf)"/.exec(chrome)?.[1];
    expect(href, "no résumé href found in HeroChrome").toBeTruthy();
    expect(existsSync(publicPath(href ?? ""))).toBe(true);
  });
});
