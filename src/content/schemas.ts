import { z } from "zod";

/**
 * Zod schemas for the site's content — flat v3 sections (hero · about ·
 * experience · projects · skills · contact). All copy is typed data
 * validated at module load; components never hardcode content.
 */

/** Mono instrument readout, e.g. `t_repeat: 38ms ← 176ms · redis warm`. */
export const readoutSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

/** One experience entry. */
export const experienceEntrySchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  engagement: z.string().min(1),
  period: z.string().min(1),
  framing: z.string().min(1),
  story: z.array(z.string().min(1)).min(1),
  readouts: z.array(readoutSchema),
  /** Real architecture facts (topology, pipelines, schema design). */
  architecture: z.array(z.string().min(1)).min(1),
  /** Resource domains, when the API surface is part of the story. */
  endpointDomains: z.array(z.string().min(1)).optional(),
  /** Lifecycle timeline lines, when applicable. */
  timeline: z.array(z.string().min(1)).optional(),
  todos: z.array(z.string().min(1)).default([]),
});

/** One project; slug backs a future `/work/[slug]` route. */
export const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  stack: z.string().min(1),
  year: z.string().nullable(),
  roleLine: z.string().min(1),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  /** Real architecture facts. */
  architecture: z.array(z.string().min(1)).min(1),
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
  hero: z.object({
    name: z.string().min(1),
    subline: z.string().min(1),
    thesis: z.string().min(1),
  }),
  about: z.object({
    summary: z.array(z.string().min(1)).length(3),
    location: z.string().min(1),
    languages: z.string().min(1),
    education: z.string().min(1),
  }),
  experience: z.array(experienceEntrySchema).length(2),
  projects: z.array(projectSchema).length(3),
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

export type Readout = z.infer<typeof readoutSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type Project = z.infer<typeof projectSchema>;
export type Capability = z.infer<typeof capabilitySchema>;
export type Content = z.infer<typeof contentSchema>;
