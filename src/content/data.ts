import type { z } from "zod";
import type { contentSchema } from "./schemas";

/**
 * The site's entire copy and data — real and final unless marked
 * TODO(author). Metrics come from the résumé only; nothing invented.
 */
export const rawContent: z.input<typeof contentSchema> = {
  site: {
    title: "Lioua Zeddam — Full Stack Developer",
    description:
      "I build the systems behind the screens. Django · React · Flutter · PostgreSQL.",
    domain: "liouazeddam.dev",
  },
  intro: {
    name: "Lioua Zeddam",
    role: "Full Stack Developer",
    line: "I build the systems behind the screens.",
    proofs: [
      { value: "100+", label: "endpoints shipped" },
      { value: "176ms → 38ms", label: "repeat-request latency" },
      { value: "6", label: "products built" },
    ],
    roleWords: [
      "Backend architecture",
      "Real-time systems",
      "Full-stack delivery",
    ],
  },
  // TODO(author): dates are from your résumé — confirm the years, and reword
  // any beat that doesn't sound like you saying it out loud.
  timeline: [
    {
      year: "2021",
      title: "Where it clicked",
      text: "I started computer science and found the part I couldn't put down — building the thing people use, not passing the exam about it. No master plan. Just that.",
    },
    {
      year: "2022",
      title: "Head down, top of the class",
      text: "The CS diploma, dual-study: half classroom, half real placement. I finished ranked first in my cohort at 14.79/20 — but it was the placement half that taught me what “it works on my machine” actually costs.",
    },
    {
      year: "2024",
      title: "First taste of production",
      text: "Ten months at Faderco, solo, building the HR portal that retired their spreadsheets. First time the word “production” meant something. I shipped their first remote interviews and stopped candidates driving four hours for a chair and a handshake.",
    },
    {
      year: "2025",
      title: "Learning Flutter the hard way",
      text: "I taught myself Flutter by building BrewPhoria end to end — offline-first cart, atomic checkout, a loyalty ledger, and an AI barista that mostly does what it's told. Nothing teaches a framework like shipping in it.",
    },
    {
      year: "Dec 2025",
      title: "First real client, first real panic",
      text: "Rezervitoo. Backend architect on a live multi-provider booking platform — real money, real users, no senior to hide behind. 100+ endpoints later, still shipping.",
    },
  ],
  about: {
    location: "Algeria · working worldwide (UTC+1)",
    languages: "AR native · EN C2 · FR B2",
    education:
      "Diploma, CS — ranked 1st in cohort · GPA 14.79/20 · dual-study, 2.5y placement",
  },
  // TODO(author): this is the site's voice — read it aloud and cut anything
  // that sounds like someone else wrote it about you.
  sections: {
    background: {
      heading: "How I got here.",
      lede: "Five years, no shortcut — the version with the 2am deploys and the “why is it slow now” left in.",
    },
    principles: {
      heading: "Things I'll argue about.",
      lede: "Opinions production beat into me. They show up in every repo I touch.",
    },
    work: {
      heading: "Things I've shipped.",
      lede: "Client work and things I built to teach myself. Sole developer on nearly all of it — schema to deploy, nobody to hand the hard parts to.",
    },
    toolkit: {
      heading: "What I reach for.",
      lede: "Not everything I've touched — the tools I'd pick again, grouped by the problem they solve.",
    },
    contact: {
      heading: "Let's build something.",
      lede: "Open to backend and full-stack work. Tell me what's breaking; I'll tell you how I'd come at it.",
    },
  },
  // TODO(author): confirm these are your real beliefs, reword freely.
  principles: [
    {
      title: "The server is the source of truth.",
      body: "Clients lie — not on purpose, just constantly. Prices, stock, permissions: recompute it all server-side and let the client be a pretty view of the truth.",
    },
    {
      title: "Real-time by default.",
      body: "If something changes and a user has to refresh to see it, that's a bug with extra steps. A WebSocket is cheaper than a confused user.",
    },
    {
      title: "Shipped beats perfect.",
      body: "A deployed feature teaches more in a week than a perfect branch does in a month. Docker it, ship it, watch it, fix it.",
    },
  ],
  // 03 — Work: client engagements and the products I built to teach myself,
  // in one list. Sole developer on nearly all of it. Voice over spec sheet —
  // the hook is the thing said out loud; the detail earns it.
  work: [
    {
      slug: "rezervitoo",
      title: "Rezervitoo",
      kind: "client",
      context: "Freelance · backend architect",
      period: "Dec 2025 — now",
      hook: "First real client. First real panic. 100+ endpoints later, still shipping.",
      summary:
        "A live multi-provider booking platform — hotels, hostels, agencies, hosts — on one backend that's mine end to end.",
      stack: "Django · DRF · PostgreSQL · Redis · Channels · TanStack Query",
      metric: {
        value: "176ms → 38ms",
        label: "repeat requests, once Redis and the query cache agreed",
      },
      highlights: [
        "Four provider types wanted four schemas. They got one polymorphic model instead — about 60% less onboarding surface.",
        "Real-time notifications over Channels and FCM, behind a custom JWT WebSocket middleware.",
        "Arabic, English, and French — the layout mirrors properly, not just the words.",
      ],
      access: "code private — client work",
      links: { live: null, source: null },
      todos: ["TODO(author): admin-panel captures"],
    },
    {
      slug: "faderco",
      title: "Faderco HR Portal",
      kind: "apprenticeship",
      context: "Apprenticeship · solo, 10 months",
      period: "2024 — 2025",
      hook: "My first production system. Built it alone, from “what do you need” to “it's live.”",
      summary:
        "An internal HR portal that retired the spreadsheets — candidate intake through offer, 50+ a cycle.",
      stack: "Django · React · PostgreSQL · WebRTC · Google OAuth2",
      metric: {
        value: "4h → 0",
        label: "candidate round-trip per interview, once WebRTC shipped",
      },
      highlights: [
        "Shipped their first remote interviewing with WebRTC — candidates stopped driving up to four hours each way.",
        "A worker-evaluation module replaced paper and saved HR two hours of typing a cycle.",
      ],
      access: "internal tool — code stays with Faderco",
      links: { live: null, source: null },
      todos: [],
    },
    {
      slug: "brewphoria",
      title: "BrewPhoria",
      kind: "product",
      context: "Personal product · solo",
      period: "2025",
      hook: "I didn't know Flutter. So I built a whole coffee app in it.",
      summary:
        "Cross-platform coffee ordering — a Flutter client on a layered Node/Express/TypeScript API.",
      stack:
        "Flutter · Node.js/Express/TS · Prisma · PostgreSQL · Redis · Gemini",
      metric: null,
      highlights: [
        "Offline-first guest cart that merges conflict-free the moment you sign in — it survives cold starts.",
        "Atomic checkout: order, stock, cart, and loyalty all move in one transaction, or none do.",
        "An AI barista (Gemini, tool-augmented) that resolves “something sweet and cold” to real menu items.",
      ],
      access: "public repo — link on its way",
      links: { live: null, source: null },
      todos: [
        "TODO(author): screens",
        "TODO(author): source link — repo currently private",
      ],
    },
    {
      slug: "fitguild",
      title: "FitGuild",
      kind: "product",
      context: "Personal product · solo",
      period: "2024",
      hook: "A full storefront with zero third-party commerce dependencies — because I wanted to know how.",
      summary:
        "E-commerce end to end — variants, cart, wishlist, orders, reviews — a Django API through a React front.",
      stack: "Django · React · PostgreSQL · Stripe · Channels",
      metric: {
        value: "< 2s",
        label: "catalog loads, measured on Core Web Vitals",
      },
      highlights: [
        "The full Stripe post-purchase loop lives server-side: payment → order transitions → inventory.",
        "Order status pushes over WebSockets instead of polling.",
      ],
      access: "live site — repo private",
      links: { live: null, source: null },
      todos: [
        "TODO(author): live URL + captures (catalog, variants, order-status mid-update)",
        "TODO(author): source link — repo currently private",
      ],
    },
    {
      slug: "cognitive-training",
      title: "Cognitive Training",
      kind: "product",
      context: "Personal product · solo",
      period: "2024",
      hook: "Fourteen little games, one big excuse to build real-time systems.",
      summary:
        "A gamified cognitive platform — 7 categories, 14 browser games, XP, and multi-dimensional ranking.",
      stack: "Django · React · PostgreSQL · Channels",
      metric: null,
      highlights: [
        "Real-time multiplayer over Channels — global chat, private messages, live leaderboards.",
        "Scoring blends accuracy, streak, and response time into per-category progression.",
      ],
      access: "repo private",
      links: { live: null, source: null },
      todos: ["TODO(author): captures (game mid-play, leaderboard, analytics)"],
    },
  ],
  skills: {
    capabilities: [
      {
        claim: "Real-time by default",
        receipt: "Channels, WebSockets, WebRTC, FCM",
      },
      {
        claim: "Caching that shows up in numbers",
        receipt: "Redis, 176→38ms",
      },
      {
        claim: "Transactions you can trust",
        receipt: "atomic checkout, append-only ledgers",
      },
      {
        claim: "Offline-first mobile",
        receipt: "Flutter, Hive, conflict-free merge",
      },
      {
        claim: "Shipped, not just built",
        receipt: "Docker, Nginx, VPS, CI",
      },
      {
        claim: "Right-to-left ready",
        receipt: "full i18n/RTL mirroring",
      },
    ],
    // Framed as working disciplines, not a resume dump — each group is how
    // the work is actually organised day to day.
    // TODO(author): extend the AI group with any assistants you use daily.
    inventory: [
      {
        group: "AI-Assisted Engineering",
        items: [
          "Google Gemini",
          "Tool-augmented agents",
          "Prompt + context design",
          "LLM feature integration",
          "Catalogue-grounded responses",
        ],
      },
      {
        group: "Back-End & APIs",
        items: [
          "Django",
          "Django REST Framework",
          "Node.js",
          "Express",
          "Prisma",
          "REST API design",
          "RBAC",
          "Polymorphic models",
          "Layered / service architecture",
        ],
      },
      {
        group: "Real-Time Systems",
        items: [
          "Django Channels (ASGI)",
          "WebSockets",
          "WebRTC",
          "Firebase FCM",
          "JWT socket middleware",
          "Live notifications",
        ],
      },
      {
        group: "Data & Caching",
        items: [
          "PostgreSQL",
          "Redis",
          "Celery",
          "Atomic transactions",
          "Append-only ledgers",
          "Pattern-based invalidation",
        ],
      },
      {
        group: "Front-End & UI",
        items: [
          "React.js",
          "TypeScript",
          "Tailwind CSS",
          "TanStack Query",
          "Redux",
          "i18n / RTL mirroring",
        ],
      },
      {
        group: "Mobile",
        items: [
          "Flutter",
          "Riverpod",
          "Freezed",
          "Hive",
          "go_router",
          "Dio",
          "Offline-first sync",
        ],
      },
      {
        group: "Cloud & DevOps",
        items: [
          "Docker",
          "Docker Compose",
          "Nginx",
          "Linux / VPS",
          "GitHub Actions",
          "Cloudflare",
          "Google Cloud (IAM, OAuth2)",
        ],
      },
      {
        group: "Languages",
        items: ["Python", "JavaScript (ES6+)", "TypeScript", "Dart", "SQL"],
      },
      {
        group: "Practice",
        items: [
          "PyTest",
          "Jest",
          "Supertest",
          "Swagger / OpenAPI",
          "Stripe",
          "Brevo",
          "Release ownership",
        ],
      },
    ],
  },
  contact: {
    closing: "200 OK — let's build.",
    // Résumé + author account use liwaa-; the v1 brief's liouazeddam@ was a
    // typo. Flagged in TASKS.md for confirmation.
    email: "liwaazeddam@gmail.com",
    linkedin: "linkedin.com/in/lioua",
    github: "github.com/Lioua-Kyto",
    phone: "[redacted]",
    todos: ["TODO(author): final resume PDF"],
  },
};
