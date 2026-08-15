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
      "rezervitoo",
      "faderco",
      "brewphoria",
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
