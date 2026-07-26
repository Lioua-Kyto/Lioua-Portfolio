import type { z } from "zod";
import type { contentSchema } from "./schemas";

/**
 * The site's entire copy and data. Reviewed and approved by the author;
 * metrics come from the résumé only, nothing invented. The remaining
 * `todos` entries are missing assets (captures, live links), not unreviewed
 * copy.
 */
export const rawContent: z.input<typeof contentSchema> = {
  site: {
    title: "Lioua Zeddam · Full Stack Developer",
    description:
      "I build the systems behind the screens. Django · React · Flutter · PostgreSQL.",
    domain: "liouazeddam.dev",
  },
  intro: {
    name: "Lioua Zeddam",
    role: "Full Stack Developer",
    line: "I build the systems behind the screens.",
    // The hook shown lower-right in the hero — the one line that has to land.
    philosophy:
      "I ship whole products, with backends that stay fast under real load.",
    // Framed for what they say about the work, not lifted off a résumé:
    // breadth, performance, and real backend scale. (§5)
    proofs: [
      {
        value: "6",
        label: "products shipped end to end",
        short: "products shipped",
      },
      {
        value: "~40ms",
        label: "cached responses, effectively instant",
        short: "cached responses",
      },
      {
        value: "400+",
        label: "API endpoints across projects",
        short: "API endpoints",
      },
    ],
  },
  // The route is told in beats, not in a count of years — what changed each
  // year says more than how many of them there have been.
  timeline: [
    {
      year: "2022",
      title: "Before it clicked",
      text: "I came to computer science the way most people come to a degree: it was the sensible next step. I did the work, and did it properly. What I hadn't found yet was the part worth chasing.",
    },
    {
      year: "2023",
      title: "The year it caught",
      text: "Then I built something that actually ran. I taught myself Python, and the moment code started doing real work I couldn't put it down.",
    },
    {
      year: "2024",
      title: "Thrown in at the deep end",
      text: "An apprenticeship at Faderco, starting from HTML and CSS. React by September, Django right after. By December I was building their internal job portal for people who depended on it, not for a grade.",
    },
    {
      year: "2025",
      title: "Graduated, then kept going",
      text: "That portal graduated me first in my class. I could have stopped there. Instead I went looking for harder problems: FitGuild, then Cognitive, then Rezervitoo, where polymorphic models, a real service layer and hard caching finally made the architecture match the ambition.",
    },
    {
      year: "2026",
      title: "Widening the stack",
      text: "Flutter and Riverpod for BrewPhoria. Node, to stretch past my Django-and-React home ground. Now AI integration, deep enough to earn the title rather than claim it. This site is the current build.",
    },
  ],
  about: {
    location: "Algeria · working worldwide (UTC+1)",
    languages: "AR native · EN C2 · FR B2",
    education:
      "Diploma, CS. Ranked 1st in cohort, GPA 14.79/20, with a 2.5-year placement.",
  },
  // The site's voice — read aloud and approved.
  sections: {
    background: {
      heading: "How I got here.",
      lede: "Not a straight line, and no shortcut. This is the version with the 2am deploys and the “why is it slow now” left in.",
    },
    principles: {
      heading: "Opinions I'll defend in review.",
      lede: "Not borrowed from a blog post. These are the three things production argued me into, and they show up in every repo I touch.",
    },
    work: {
      heading: "Things I've shipped.",
      lede: "Client work and things I built to teach myself. Sole developer on nearly all of it, schema to deploy, with nobody to hand the hard parts to.",
    },
    toolkit: {
      heading: "What I reach for.",
      lede: "Not everything I've touched. These are the tools I'd pick again, grouped by the problem they solve.",
    },
    contact: {
      heading: "Let's build something.",
      lede: "Open to backend and full-stack work. Tell me what's breaking; I'll tell you how I'd come at it.",
    },
  },
  // Confirmed by the author as genuinely held, each with its receipt.
  principles: [
    {
      title: "The server is the source of truth.",
      body: "A browser can be edited, replayed, or simply out of date. Never maliciously, just constantly. Prices, stock, permissions: recompute all of it server-side and let the front end be a pretty view of the truth.",
      practice:
        "Rezervitoo decides every price and every availability window on the backend. The client renders what it is told, and nothing it renders can be argued with.",
    },
    {
      title: "Real-time by default.",
      body: "If something changes and a user has to refresh to see it, that's a bug with extra steps. A WebSocket costs less than a confused user.",
      practice:
        "Faderco's hiring loop ran on a four-hour round-trip per candidate. Pushing state over Channels instead of waiting for a refresh took it to zero.",
    },
    {
      title: "Shipped beats perfect.",
      body: "A deployed feature teaches more in a week than a perfect branch does in a month. Docker it, ship it, watch it, fix what the traffic actually breaks.",
      practice:
        "Six products end to end. Every one of them taught me something the branch never would have, including the caching that took 176ms down to 40ms.",
    },
  ],
  // 03 — Work: client engagements and the products I built to teach myself,
  // in one list. Sole developer on nearly all of it. Voice over spec sheet —
  // the hook is the thing said out loud; the detail earns it.
  work: [
    {
      slug: "rezervitoo",
      title: "Rezervitoo",
      kind: "flagship",
      context: "Backend architect · the project I'm proudest of",
      period: "Dec 2025 - now",
      hook: "The one I'm proudest of. The architecture finally caught up to the ambition.",
      summary:
        "A live multi-provider booking platform (hotels, hostels, agencies, hosts) on one backend that's mine end to end.",
      stack: "Django · DRF · PostgreSQL · Redis · Channels · TanStack Query",
      metric: {
        value: "~40ms",
        label: "cached responses, down from 176ms",
      },
      highlights: [
        "Four provider types wanted four schemas. They got one polymorphic model instead, cutting the onboarding surface by about 60%.",
        "Real-time notifications over Channels and FCM, behind a custom JWT WebSocket middleware.",
        "Arabic, English, and French. The layout mirrors properly, not just the words.",
      ],
      cover: {
        src: "/work/Rezervitoo/dashboard.webp",
        alt: "Rezervitoo's provider dashboard showing bookings, listings and revenue.",
        fit: "cover",
      },
      gallery: [
        {
          src: "/work/Rezervitoo/dashboard.webp",
          alt: "The Rezervitoo provider dashboard.",
          caption:
            "Where a provider lands: occupancy, bookings and revenue resolved server-side before the page paints.",
          fit: "cover",
        },
        {
          src: "/work/Rezervitoo/listings.webp",
          alt: "The listings index.",
          caption:
            "Hotels, hostels, agencies and hosts in one index. Four provider types, one polymorphic model underneath.",
          fit: "cover",
        },
        {
          src: "/work/Rezervitoo/listing-details.webp",
          alt: "A single listing's detail view.",
          caption: null,
          fit: "contain",
        },
        {
          src: "/work/Rezervitoo/providers-ar.webp",
          alt: "The providers screen rendered in Arabic, right to left.",
          caption:
            "The same screen in Arabic. The layout mirrors: navigation, tables, icons, not just the strings.",
          fit: "cover",
        },
        {
          src: "/work/Rezervitoo/swagger-api.webp",
          alt: "The project's OpenAPI documentation.",
          caption:
            "Every endpoint documented as it was written. This is where the 400+ figure comes from.",
          fit: "cover",
        },
        {
          src: "/work/Rezervitoo/dashboard-dark.webp",
          alt: "The dashboard in dark mode.",
          caption:
            "Theming is a token swap, not a second stylesheet.",
          fit: "cover",
        },
        {
          src: "/work/Rezervitoo/reports.webp",
          alt: "The reports queue.",
          caption:
            "Moderation and reporting, because a multi-provider marketplace needs an answer for bad actors on day one.",
          fit: "cover",
        },
        {
          src: "/work/Rezervitoo/notifications-dark.webp",
          alt: "Live notifications.",
          caption:
            "Pushed over Channels behind a custom JWT WebSocket middleware. No polling, no refresh.",
          fit: "cover",
        },
      ],
      access: "code private, production client work",
      links: { live: null, source: null },
      todos: ["TODO(author): admin-panel captures"],
    },
    {
      slug: "faderco",
      title: "Faderco HR Portal",
      kind: "apprenticeship",
      context: "Apprenticeship · solo, 10 months",
      period: "2024 - 2025",
      hook: "My first production system. Built it alone, from “what do you need” to “it's live.”",
      summary:
        "An internal HR portal that retired the spreadsheets: candidate intake through offer, 50+ a cycle.",
      stack: "Django · React · PostgreSQL · WebRTC · Google OAuth2",
      metric: {
        value: "4h → 0",
        label: "candidate round-trip per interview, once WebRTC shipped",
      },
      highlights: [
        "Shipped their first remote interviewing with WebRTC. Candidates stopped driving up to four hours each way.",
        "A worker-evaluation module replaced paper and saved HR two hours of typing a cycle.",
      ],
      cover: {
        src: "/work/JobPortal/hr-callroom.webp",
        alt: "The Faderco portal's in-browser interview room, built on WebRTC.",
        fit: "cover",
      },
      gallery: [
        {
          src: "/work/JobPortal/hr-callroom.webp",
          alt: "The in-browser interview room.",
          caption:
            "The change that mattered: interviews moved into the browser over WebRTC, and a four-hour round-trip per candidate became zero.",
          fit: "cover",
        },
        {
          src: "/work/JobPortal/hr-dashboard.webp",
          alt: "The HR dashboard.",
          caption:
            "The pipeline at a glance. This is what replaced the spreadsheet.",
          fit: "cover",
        },
        {
          src: "/work/JobPortal/hr-applications.webp",
          alt: "The applications queue.",
          caption:
            "Intake through offer for 50+ candidates a cycle.",
          fit: "cover",
        },
        {
          src: "/work/JobPortal/hr-interviews.webp",
          alt: "Interview scheduling.",
          caption: null,
          fit: "cover",
        },
        {
          src: "/work/JobPortal/hr-talentpool.webp",
          alt: "The talent pool.",
          caption:
            "Candidates who were not right this time, kept findable for when they are.",
          fit: "cover",
        },
        {
          src: "/work/JobPortal/hr-jobposts.webp",
          alt: "Job post management.",
          caption: null,
          fit: "cover",
        },
        {
          src: "/work/JobPortal/dm-dashboard.webp",
          alt: "The department manager's view.",
          caption:
            "A second role with its own surface: managers raise requests, HR runs the process.",
          fit: "cover",
        },
        {
          src: "/work/JobPortal/login.webp",
          alt: "Sign-in, over Google OAuth2.",
          caption: null,
          fit: "cover",
        },
      ],
      access: "internal tool, code stays with Faderco",
      links: { live: null, source: null },
      todos: [],
    },
    {
      slug: "brewphoria",
      title: "BrewPhoria",
      kind: "product",
      context: "Personal product · solo",
      period: "2026",
      hook: "I didn't know Flutter. So I built a whole coffee app in it.",
      summary:
        "Cross-platform coffee ordering: a Flutter client on a layered Node/Express/TypeScript API.",
      stack:
        "Flutter · Node.js/Express/TS · Prisma · PostgreSQL · Redis · Gemini",
      metric: null,
      highlights: [
        "Offline-first guest cart that merges conflict-free the moment you sign in. It survives cold starts.",
        "Atomic checkout: order, stock, cart, and loyalty all move in one transaction, or none do.",
        "An AI barista (Gemini, tool-augmented) that resolves “something sweet and cold” to real menu items.",
      ],
      cover: {
        src: "/work/Brewphoria/home-l.webp",
        alt: "BrewPhoria's storefront home screen on mobile.",
        fit: "contain",
      },
      gallery: [
        {
          src: "/work/Brewphoria/onboarding-1.webp",
          alt: "The onboarding screen.",
          caption:
            "First Flutter build. I did not know the framework when I started this.",
          fit: "contain",
        },
        {
          src: "/work/Brewphoria/home-l.webp",
          alt: "The storefront home screen.",
          caption: null,
          fit: "contain",
        },
        {
          src: "/work/Brewphoria/product-detail-l-1.webp",
          alt: "A product detail screen.",
          caption:
            "Options, sizes and extras priced as you choose them.",
          fit: "contain",
        },
        {
          src: "/work/Brewphoria/product-detail-options-d.webp",
          alt: "Product options in dark mode.",
          caption:
            "Light and dark carried through every screen, not just the shell.",
          fit: "contain",
        },
        {
          src: "/work/Brewphoria/cart-l.webp",
          alt: "The cart.",
          caption: null,
          fit: "contain",
        },
        {
          src: "/work/Brewphoria/checkout-l.webp",
          alt: "Checkout.",
          caption: null,
          fit: "contain",
        },
        {
          src: "/work/Brewphoria/loyalty-l.webp",
          alt: "The loyalty screen.",
          caption:
            "Points, tiers and redemption: the reason a coffee app gets opened twice a day.",
          fit: "contain",
        },
        {
          src: "/work/Brewphoria/orders-d.webp",
          alt: "Order history in dark mode.",
          caption: null,
          fit: "contain",
        },
      ],
      access: "public repo, link on its way",
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
      period: "2025",
      hook: "A full storefront with zero third-party commerce dependencies, because I wanted to know how.",
      summary:
        "E-commerce end to end: variants, cart, wishlist, orders and reviews, on a Django API through a React front.",
      stack: "Django · React · PostgreSQL · Stripe · Channels",
      metric: {
        value: "< 2s",
        label: "catalog loads, measured on Core Web Vitals",
      },
      highlights: [
        "The full Stripe post-purchase loop lives server-side: payment → order transitions → inventory.",
        "Order status pushes over WebSockets instead of polling.",
      ],
      cover: {
        src: "/work/FitGuild/home.webp",
        alt: "FitGuild's storefront home page.",
        fit: "cover",
      },
      gallery: [
        {
          src: "/work/FitGuild/home.webp",
          alt: "The FitGuild storefront.",
          caption:
            "Built to sharpen the full-stack loop end to end: storefront, admin and the data between them.",
          fit: "cover",
        },
        {
          src: "/work/FitGuild/shop.webp",
          alt: "The shop index.",
          caption: null,
          fit: "cover",
        },
        {
          src: "/work/FitGuild/p-details.webp",
          alt: "A product page.",
          caption: null,
          fit: "cover",
        },
        {
          src: "/work/FitGuild/checkout.webp",
          alt: "Checkout.",
          caption:
            "Atomic. The order either exists completely or not at all.",
          fit: "cover",
        },
        {
          src: "/work/FitGuild/ad-analytics.webp",
          alt: "The admin analytics view.",
          caption:
            "The half most storefront demos skip: the operator's side.",
          fit: "cover",
        },
        {
          src: "/work/FitGuild/ad-products.webp",
          alt: "Product administration.",
          caption: null,
          fit: "cover",
        },
        {
          src: "/work/FitGuild/ad-orders.webp",
          alt: "Order administration.",
          caption: null,
          fit: "cover",
        },
        {
          src: "/work/FitGuild/ad-inventory.webp",
          alt: "Inventory.",
          caption: null,
          fit: "cover",
        },
      ],
      access: "live site, repo private",
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
      period: "2025",
      hook: "Fourteen little games, one big excuse to build real-time systems.",
      summary:
        "A gamified cognitive platform: 7 categories, 14 browser games, XP, and multi-dimensional ranking.",
      stack: "Django · React · PostgreSQL · Channels",
      metric: null,
      highlights: [
        "Real-time multiplayer over Channels: global chat, private messages, live leaderboards.",
        "Scoring blends accuracy, streak, and response time into per-category progression.",
      ],
      cover: null,
      gallery: [],
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
    inventory: [
      {
        group: "AI-Assisted Engineering",
        items: [
          "Google Gemini",
          "Tool-augmented agents",
          "Prompt + context design",
          "LLM feature integration",
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
        group: "Testing & Tooling",
        items: [
          "PyTest",
          "Jest",
          "Supertest",
          "Postman",
          "Swagger / OpenAPI",
          "Git / code review",
        ],
      },
    ],
  },
  contact: {
    closing: "200 OK. Let's build.",
    // The résumé and the author's account both use the liwaa- address; an
    // earlier liouazeddam@ spelling was a typo.
    email: "liwaazeddam@gmail.com",
    linkedin: "linkedin.com/in/lioua",
    github: "github.com/Lioua-Kyto",
    todos: [],
  },
};
