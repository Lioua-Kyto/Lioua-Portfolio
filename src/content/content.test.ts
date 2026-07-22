import { describe, expect, it } from "vitest";
import { contentSchema } from "./schemas";
import { rawContent } from "./data";
import { content } from "./index";

describe("content", () => {
  it("passes full schema validation", () => {
    expect(() => contentSchema.parse(rawContent)).not.toThrow();
  });

  it("has exactly two experience entries and three projects with unique slugs", () => {
    expect(content.experience.length).toBe(2);
    const slugs = content.projects.map((p) => p.slug);
    expect(slugs).toEqual(["brewphoria", "fitguild", "cognitive-training"]);
    expect(new Set(slugs).size).toBe(3);
  });

  it("keeps the résumé's real metrics intact (never invented, never drifted)", () => {
    const rezervitoo = content.experience[0];
    expect(rezervitoo?.readouts.map((r) => `${r.label}: ${r.value}`)).toContain(
      "t_repeat: 38ms ← 176ms · redis warm",
    );
  });

  it("uses the résumé's contact email", () => {
    expect(content.contact.email).toBe("liwaazeddam@gmail.com");
  });
});
