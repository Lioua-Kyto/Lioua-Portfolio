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
  // TODO(author): confirm the first beat's framing and all dates (§3.01).
  timeline: [
    {
      year: "Early",
      text: "Started computer science and discovered the part I actually loved: building things people could use, not just passing exams about them.",
    },
    {
      year: "2022",
      text: "Began the CS diploma — dual-study, half classroom, half real placement. Finished ranked 1st in cohort with a 14.79/20 GPA, which I'm told is good.",
    },
    {
      year: "2024",
      text: "Faderco apprenticeship — my first production work. Built their HR recruitment portal solo over 10 months: 50+ candidates a cycle, the company's first remote interviews, and a lasting respect for the word 'production'.",
    },
    {
      year: "2025",
      text: "Learned Flutter properly by building BrewPhoria end to end — offline-first cart, atomic checkout, a loyalty ledger, and an AI barista that mostly does what it's told.",
    },
    {
      year: "Dec 2025",
      text: "Rezervitoo — first major freelance client. Backend architect on a real multi-provider booking platform. First real client, first real panic; 100+ endpoints later, still shipping.",
    },
  ],
  about: {
    location: "Algeria · working worldwide (UTC+1)",
    languages: "AR native · EN C2 · FR B2",
    education:
      "Diploma, CS — ranked 1st in cohort · GPA 14.79/20 · dual-study, 2.5y placement",
  },
  // TODO(author): confirm these are your real beliefs, reword freely (§3.02).
  principles: [
    {
      title: "The server is the source of truth.",
      body: "Clients lie — not maliciously, just constantly. Prices, stock, permissions: recompute everything server-side and let the client be a pretty view of the truth.",
    },
    {
      title: "Real-time by default.",
      body: "If data changes and someone has to refresh to see it, that's a bug with extra steps. A WebSocket is cheaper than a confused user.",
    },
    {
      title: "Shipped beats perfect.",
      body: "A deployed feature teaches more in a week than a perfect branch does in a month. Docker it, ship it, watch it, fix it.",
    },
  ],
  experience: [
    {
      company: "Rezervitoo",
      role: "Backend Architect & Admin Frontend Developer",
      engagement: "Freelance",
      period: "Dec 2025 – Present",
      framing:
        "Backend + admin panel: sole owner · mobile + website: collaborator",
      story: [
        "Rezervitoo is a multi-provider travel and booking platform — hotels, hostels, agencies, and hosts on one backend — and the backend is mine, end to end.",
        "That means 100+ endpoints across 7 domains, Swagger-documented, RBAC on every route: the kind of surface area where naming things badly punishes you for months.",
        "Repeat requests dropped from 176ms to 38ms once Redis and TanStack Query started agreeing with each other. Notifications go out in real time over Channels and FCM, behind a custom JWT WebSocket middleware.",
        "Four provider types wanted four schemas. They got one polymorphic model instead — 60% less onboarding surface, and the site speaks Arabic, English, and French with the layout mirroring properly, not just the words.",
      ],
      pull: {
        label: "repeat-request latency, redis warm",
        value: "176ms → 38ms",
      },
      access: "code private — client work",
      readouts: [
        { label: "endpoints", value: "100+ across 7 domains" },
        { label: "t_repeat", value: "38ms ← 176ms · redis warm" },
        {
          label: "schemas",
          value:
            "4 provider types → 1 polymorphic model · −60% onboarding surface",
        },
      ],
      architecture: [
        "topology: docker compose + nginx + cloudflare ssl (strict)",
        "endpoint tree: 7 domains — auth, users, listings, bookings, reviews, reports, notifications · rbac suffixes (role: admin|provider)",
        "notifications: django channels (asgi) + fcm + custom jwt websocket middleware",
        "schema: 4 accommodation types unified under one polymorphic model",
        "cache: redis + tanstack query client sync — 176ms → 38ms on repeat requests",
        "i18n: ar/en/fr · full rtl/ltr mirroring · django-modeltranslation + css logical properties",
      ],
      endpointDomains: [
        "auth",
        "users",
        "listings",
        "bookings",
        "reviews",
        "reports",
        "notifications",
      ],
      todos: ["TODO(author): admin panel captures"],
    },
    {
      company: "Faderco",
      role: "Full Stack Developer",
      engagement: "Apprenticeship (dual-study)",
      period: "Jan 2024 – Apr 2025",
      framing: "Sole owner, requirements → production, 10 months",
      story: [
        "An internal HR recruitment portal that retired the spreadsheets — candidate intake through offer, 50+ candidates a cycle. My first production system, built solo over 10 months from requirements gathering to deploy.",
        "The company sits somewhere isolated, so I shipped their first remote interviewing with WebRTC — candidates stopped traveling up to 4 hours round-trip for an interview.",
        "Real-time notifications replaced manual follow-up, and a worker evaluation module replaced paper, saving HR 2+ hours of typing per cycle.",
      ],
      pull: {
        label: "candidates per cycle, spreadsheets retired",
        value: "50+",
      },
      access: "internal tool — code stays with Faderco",
      readouts: [
        { label: "candidates", value: "50+ per cycle · zero spreadsheets" },
        { label: "travel_saved", value: "up to 4h per interview · webrtc" },
        { label: "ownership", value: "solo · 10 months · req → prod" },
      ],
      architecture: [
        "rbac: 3+ roles × django permissions + google oauth2 — data privacy over sensitive hr records",
        "pipeline: interview/evaluation state machine — intake → screen → interview → evaluate → offer",
        "timeline: 10-month solo lifecycle — requirements → production, zero prior internal tooling",
      ],
      timeline: [
        "2024-01 init: requirements gathering with hr stakeholders",
        "2024-04 feat: candidate pipeline — intake → offer, spreadsheets retired",
        "2024-07 feat: remote interviews — webrtc + streamapi",
        "2024-09 feat: live notifications — hr + candidates, in-app",
        "2024-11 feat: worker evaluation module — paper workflows replaced",
        "2025-01 feat: rbac — 3+ roles × django permissions + google oauth2",
        "2025-04 release: production deploy — full pipeline live",
      ],
      todos: [],
    },
  ],
  projects: [
    {
      slug: "brewphoria",
      title: "BrewPhoria",
      stack: "Flutter · Node.js/Express/TS · Prisma · PostgreSQL · Redis",
      year: null,
      roleLine: "sole developer",
      summary:
        "Cross-platform coffee-ordering app — Flutter client on a layered Node.js/Express/TypeScript API.",
      highlights: [
        "Offline-first guest cart (Hive) merging conflict-free on sign-in — surviving cold starts via a pending-merge flag.",
        "Tiered loyalty programme: earn multipliers, 100 pts = $1 redemption, backed by an append-only ledger.",
        "AI barista (Gemini, tool-augmented) that resolves product tags to real catalogue items.",
      ],
      architecture: [
        "atomic checkout: order create + stock decrement + cart clear + loyalty move in one prisma transaction · all pricing recomputed server-side (client untrusted)",
        "api surface: 40+ endpoints across 11 domains",
        "cache: redis per-query keys + pattern-based invalidation on writes",
        "loyalty: append-only ledger schema",
      ],
      repoLabel: "public repo — link on its way",
      links: { live: null, source: null },
      todos: [
        "TODO(author): screens",
        "TODO(author): source link — repo currently private",
      ],
    },
    {
      slug: "fitguild",
      title: "FitGuild",
      stack: "Django · React · PostgreSQL · Stripe",
      year: null,
      roleLine: "sole developer",
      summary:
        "E-commerce platform with a complete commerce feature set and zero third-party commerce dependencies.",
      highlights: [
        "Product variants, SKUs, cart, wishlist, order history, and reviews — REST API through React UI.",
        "Sub-2s catalog loads confirmed via Core Web Vitals profiling.",
      ],
      architecture: [
        "stripe webhooks: full post-purchase event loop server-side — payment → order transitions → inventory decrement",
        "cache: multi-layer nginx caching",
        "realtime: channels asgi order-status push over persistent websockets, replacing polling",
      ],
      repoLabel: "live site — repo private",
      links: { live: null, source: null },
      todos: [
        "TODO(author): live URL + captures (catalog, variants, order-status mid-update)",
        "TODO(author): source link — repo currently private",
      ],
    },
    {
      slug: "cognitive-training",
      title: "Cognitive Training Platform",
      stack: "Django · React · PostgreSQL",
      year: null,
      roleLine: "sole developer",
      summary:
        "Gamified cognitive platform — 7 categories, 14 browser games, dynamic difficulty, XP progression, multi-dimensional ranking.",
      highlights: [
        "14 interactive browser-based games across 7 categories with dynamic difficulty scaling.",
        "XP progression and a multi-dimensional ranking system.",
      ],
      architecture: [
        "realtime multiplayer: channels websockets — global chat, private messaging, live leaderboards",
        "scoring: accuracy × streak × response time → per-category analytics and progression insights",
      ],
      repoLabel: "repo private",
      links: { live: null, source: null },
      todos: [
        "TODO(author): captures (game mid-play, leaderboard, analytics)",
        "TODO(author): source link — repo currently private",
      ],
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
