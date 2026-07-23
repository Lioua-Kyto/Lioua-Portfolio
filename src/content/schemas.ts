import { z } from "zod";

/**
 * Zod schemas for the site's content — flat v3 sections (hero · about ·
 * experience · projects · skills · contact). All copy is typed data
 * validated at module load; components never hardcode content.
 */

/** A section's opening: the line that carries it, and the line under it. */
export const sectionCopySchema = z.object({
  heading: z.string().min(1),
  lede: z.string().min(1),
});

/** A pulled-out number: the value large, the label small underneath. */
export const readoutSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

/**
 * One piece of work — client engagements and personal products in a single
 * shape, because the site presents them as one body of work, not two lists.
 * `kind` is the only thing that tells them apart in the UI.
 */
export const workSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  kind: z.enum(["client", "apprenticeship", "product"]),
  /** Terse role/engagement line, e.g. `Freelance · backend architect`. */
  context: z.string().min(1),
  period: z.string().min(1),
  /** The human one-liner — the thing said out loud, not the spec. */
  hook: z.string().min(1),
  summary: z.string().min(1),
  stack: z.string().min(1),
  /** The one number worth pulling out, when there is one. */
  metric: readoutSchema.nullable(),
  highlights: z.array(z.string().min(1)).min(1).max(3),
  /** Honest access/status line, e.g. `code private — client work`. */
  access: z.string().min(1),
  links: z.object({
    live: z.url().nullable(),
    source: z.url().nullable(),
  }),
  todos: z.array(z.string().min(1)).default([]),
});

/** One capability statement: claim + its receipt. */
export const capabilitySchema = z.object({
  claim: z.string().min(1),
  receipt: z.string().min(1),
});

/** The complete validated content tree consumed by the app. */
export const contentSchema = z.object({
  site: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    /** Assumed domain — confirm with author. */
    domain: z.string().min(1),
  }),
  /** 00 — Intro (v3 brief §3.00): name, role, one honest line, proof numbers. */
  intro: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    line: z.string().min(1),
    proofs: z
      .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
      .length(3),
    /** Rotating role-words for the Phase 3 hero (motion spec §2). */
    roleWords: z.array(z.string().min(1)).min(3).max(4),
  }),
  /** 01 — Background: the honest year-by-year arc — the story spine. Each
      beat has a short title (the heynesh move) and a human paragraph. */
  timeline: z
    .array(
      z.object({
        year: z.string().min(1),
        title: z.string().min(1),
        text: z.string().min(1),
      }),
    )
    .min(4)
    .max(6),
  about: z.object({
    location: z.string().min(1),
    languages: z.string().min(1),
    education: z.string().min(1),
  }),
  /**
   * The line each section opens with. Kept here rather than in the components
   * so the site's voice can be read and revised in one sitting.
   */
  sections: z.object({
    background: sectionCopySchema,
    principles: sectionCopySchema,
    work: sectionCopySchema,
    toolkit: sectionCopySchema,
    contact: sectionCopySchema,
  }),
  /** 02 — How I build: 2–3 genuine principles, human voice. */
  principles: z
    .array(z.object({ title: z.string().min(1), body: z.string().min(1) }))
    .min(2)
    .max(3),
  /** 03 — Work: client engagements and personal products, one merged list. */
  work: z.array(workSchema).min(3).max(6),
  skills: z.object({
    capabilities: z.array(capabilitySchema).length(6),
    inventory: z
      .array(
        z.object({
          group: z.string().min(1),
          items: z.array(z.string().min(1)).min(1),
        }),
      )
      .min(1),
  }),
  contact: z.object({
    closing: z.string().min(1),
    email: z.email(),
    linkedin: z.string().min(1),
    github: z.string().min(1),
    /** Rendered as text, never as a stat. */
    phone: z.string().min(1),
    todos: z.array(z.string().min(1)).default([]),
  }),
});

export type SectionCopy = z.infer<typeof sectionCopySchema>;
export type Readout = z.infer<typeof readoutSchema>;
export type Work = z.infer<typeof workSchema>;
export type Capability = z.infer<typeof capabilitySchema>;
export type Content = z.infer<typeof contentSchema>;
