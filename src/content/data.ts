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
  hero: {
    name: "LIOUA ZEDDAM",
    subline: "Full Stack Developer — Django · React · Flutter · PostgreSQL",
    thesis: "I build the systems behind the screens.",
  },
  about: {
    summary: [
      "I own the full stack end-to-end — production web and cross-platform mobile, from data model to deployed interface.",
      "My specialty is high-performance backend architecture: REST design, real-time WebSocket systems, Redis caching, transactional integrity, containerized VPS deployments.",
      "I work directly with clients and stakeholders, from requirements through production.",
    ],
    location: "Algeria · working worldwide (UTC+1)",
    languages: "AR native · EN C2 · FR B2",
    education:
      "Diploma, CS — ranked 1st in cohort · GPA 14.79/20 · dual-study, 2.5y placement",
  },
  experience: [
    {
      company: "Rezervitoo",
      role: "Backend Architect & Admin Frontend Developer",
      engagement: "Freelance",
      period: "Dec 2025 – Present",
      framing:
        "Backend + admin panel: sole owner · mobile + website: collaborator",
      story: [
        "A multi-provider travel & booking platform — Hotels, Hostels, Agencies, and Hosts on one backend.",
        "100+ Swagger-documented REST endpoints across 7 domains, RBAC enforced on every route.",
        "A bidirectional review and report system with moderation hooks feeding deep-linked admin views.",
        "Full RTL/LTR mirroring for Arabic, English, and French — the layout structurally adapts to language direction.",
        "React TypeScript admin panel with millisecond-range load times, Google OAuth2, Brevo transactional email, progressive provider onboarding.",
      ],
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
        "Digitized the full HR recruitment pipeline — candidate intake through offer — for 50+ candidates per cycle, replacing manual spreadsheet tracking.",
        "Shipped the company's first remote interviewing with WebRTC, eliminating up to 4 hours of round-trip travel per interview.",
        "Real-time notifications to HR staff and candidates replaced manual follow-up across the interview and evaluation pipeline.",
        "A worker evaluation module replaced paper-based assessment, saving HR 2+ hours of manual input per cycle.",
      ],
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
    inventory: [
      {
        group: "Languages",
        items: ["Python", "JavaScript (ES6+)", "TypeScript", "Dart", "SQL"],
      },
      {
        group: "Backend",
        items: [
          "Django",
          "Django REST Framework",
          "Node.js",
          "Express",
          "Prisma",
          "PostgreSQL",
          "Redis",
          "Celery",
        ],
      },
      {
        group: "Mobile",
        items: ["Flutter", "Riverpod", "Freezed", "Hive", "go_router", "Dio"],
      },
      {
        group: "Frontend",
        items: ["React.js", "Tailwind CSS", "TanStack Query", "Redux"],
      },
      {
        group: "Infrastructure / DevOps",
        items: [
          "Docker",
          "Docker Compose",
          "Nginx",
          "Linux/VPS",
          "Git",
          "GitHub Actions",
        ],
      },
      {
        group: "Real-Time & AI",
        items: [
          "Django Channels (ASGI)",
          "WebSockets",
          "WebRTC",
          "Firebase (Auth/FCM)",
          "Google Gemini",
        ],
      },
      {
        group: "Cloud & APIs",
        items: [
          "Google Cloud (IAM, OAuth2)",
          "Stripe",
          "Cloudflare",
          "Brevo",
          "Swagger/OpenAPI",
        ],
      },
      {
        group: "Architecture",
        items: [
          "REST API Design",
          "RBAC",
          "Layered / Service Architecture",
          "Polymorphic Models",
          "Offline-First",
          "i18n/RTL",
        ],
      },
      {
        group: "Testing",
        items: ["PyTest", "Jest", "Supertest"],
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
