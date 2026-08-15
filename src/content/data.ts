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
    // Every clause is a claim that can be checked, not an adjective: schemas
    // hold or they don't, caches invalidate correctly or they serve stale
    // reads. "Absolute performance" would say less than "under real load".
    philosophy:
      "I engineer end-to-end systems. No bloated architecture: schemas that hold, caches that invalidate correctly, backends that stay fast under real load.",
    // Framed for what they say about the work, not lifted off a résumé:
    // breadth, measured performance, and documented backend surface. The
    // reader is a hiring manager scanning for whether this is weekend code.
    proofs: [
      {
        value: "6",
        label: "production-ready applications shipped end-to-end",
        short: "shipped end-to-end",
      },
      {
        value: "~40ms",
        label: "average cached API latency under load",
        short: "avg cached latency",
      },
      {
        value: "400+",
        label: "REST API endpoints engineered and documented",
        short: "REST endpoints",
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
      text: "Flutter and Riverpod for BrewPhoria. Node, to stretch past my Django-and-React home ground. Now AI integration, moving past API wrappers into custom tooling and real business logic. This site is the current build.",
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
        "Faderco's hiring loop cost a candidate four hours of driving each way. Moving the interview into the browser cut it to a fifteen-minute call, and live updates meant nobody refreshed a page to find out what changed.",
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
      period: "2026",
      hook: "The one I'm proudest of. The architecture finally caught up to the ambition.",
      summary:
        "A live multi-provider booking platform (hotels, hostels, agencies, hosts) on one backend that's mine end to end.",
      stack:
        "Django · React · PostgreSQL · Redis · Channels · TanStack Query · TypeScript · DRF",
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
          caption: "Theming is a token swap, not a second stylesheet.",
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
      diagram: {
        title: "How a booking request is answered",
        caption:
          "Four kinds of provider, one backend. Every price and every availability window is decided on the server before anything reaches a screen.",
        columns: [
          {
            title: "Who calls",
            nodes: [
              {
                id: "web",
                label: "Traveller web app",
                note: "Search, book, review",
                kind: "client",
              },
              {
                id: "prov",
                label: "Provider dashboard",
                note: "Listings, bookings, revenue",
                kind: "client",
              },
              {
                id: "admin",
                label: "Admin panel",
                note: "Moderation and reports",
                kind: "client",
              },
            ],
          },
          {
            title: "The way in",
            nodes: [
              {
                id: "edge",
                label: "Nginx + Cloudflare",
                note: "TLS, caching, rate limits",
                kind: "service",
              },
              {
                id: "auth",
                label: "JWT middleware",
                note: "Also guards the WebSocket handshake",
                kind: "service",
              },
            ],
          },
          {
            title: "The service",
            nodes: [
              {
                id: "api",
                label: "Django REST API",
                note: "The endpoints the apps talk to",
                kind: "service",
              },
              {
                id: "svc",
                label: "Service layer",
                note: "Pricing, availability, permissions",
                kind: "service",
              },
              {
                id: "ws",
                label: "Channels (ASGI)",
                note: "WebSocket notifications to the browser",
                kind: "service",
              },
            ],
          },
          {
            title: "What it keeps",
            nodes: [
              {
                id: "pg",
                label: "PostgreSQL",
                note: "One polymorphic model for all four provider types",
                kind: "data",
              },
              {
                id: "redis",
                label: "Redis",
                note: "Response cache and the channel layer",
                kind: "data",
              },
              {
                id: "fcm",
                label: "Firebase FCM",
                note: "Push to phones, app closed or open",
                kind: "external",
              },
            ],
          },
        ],
        flows: [
          { from: "web", to: "edge", label: null },
          { from: "prov", to: "edge", label: null },
          { from: "admin", to: "edge", label: null },
          { from: "edge", to: "auth", label: null },
          { from: "auth", to: "api", label: null },
          { from: "api", to: "svc", label: null },
          { from: "svc", to: "pg", label: null },
          { from: "svc", to: "redis", label: "~40ms cached" },
          { from: "ws", to: "redis", label: null },
          { from: "ws", to: "fcm", label: null },
          { from: "auth", to: "ws", label: null },
        ],
      },
      erd: null,
      flow: {
        title: "From a search to a stay",
        caption:
          "Nothing a traveller sends is treated as a price. The server works out what a stay costs, the provider decides whether it happens, and only a booking that actually completed can be reviewed.",
        lanes: [
          { id: "trav", label: "Traveller" },
          { id: "api", label: "The service" },
          { id: "prov", label: "Provider" },
          { id: "pay", label: "Payments" },
        ],
        steps: [
          {
            id: "r1",
            lane: "trav",
            label: "Searches by place and dates",
            note: "State, province, guests, duration",
            state: null,
            kind: "step",
          },
          {
            id: "r2",
            lane: "api",
            label: "Prices the stay server-side",
            note: "Cached, and never taken from the client",
            state: "~40ms",
            kind: "step",
          },
          {
            id: "r3",
            lane: "trav",
            label: "Requests the booking",
            note: "Held against the listing's quantity",
            state: "PENDING",
            kind: "step",
          },
          {
            id: "r4",
            lane: "prov",
            label: "Accepts or declines",
            note: "Whichever it is, the traveller is told at once",
            state: "ACCEPTED",
            kind: "gate",
          },
          {
            id: "r5",
            lane: "pay",
            label: "Takes the transaction",
            note: "Recorded per booking, not per user",
            state: "PAID",
            kind: "gate",
          },
          {
            id: "r6",
            lane: "api",
            label: "Pushes the change",
            note: "Sockets to the browser, FCM to phones",
            state: null,
            kind: "step",
          },
          {
            id: "r7",
            lane: "trav",
            label: "Stays, then reviews",
            note: "A review is tied to a booking that happened",
            state: "COMPLETED",
            kind: "end",
          },
        ],
      },
      access: "code private, production client work",
      links: { live: null, source: null },
      todos: ["TODO(author): admin-panel captures"],
    },
    {
      slug: "faderco",
      title: "Faderco HR Portal",
      kind: "apprenticeship",
      context: "Apprenticeship · solo, 10 months",
      period: "2024",
      hook: "My first production system. Built it alone, from “what do you need” to “it's live.”",
      summary:
        "An internal HR portal that retired the spreadsheets: candidate intake through offer, 50+ a cycle.",
      stack:
        "Django · React · PostgreSQL · Bootstrap · Stream · WebRTC · Google OAuth2",
      metric: {
        value: "4h → 15min",
        label: "per interview, once the call moved into the browser",
      },
      highlights: [
        "Shipped their first remote interviewing on the Stream API. A four-hour drive each way became a fifteen-minute call in the browser.",
        "Every interview room is a UUID with a per-candidate guest id and an expiring token, so a link cannot be forwarded into an open door.",
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
          caption: "Intake through offer for 50+ candidates a cycle.",
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
      diagram: {
        title: "From a vacancy to a hire",
        caption:
          "A hiring pipeline with two roles on it: managers raise the need, HR runs the process, and the interview happens in the browser.",
        columns: [
          {
            title: "Who calls",
            nodes: [
              {
                id: "dm",
                label: "Department manager",
                note: "Raises the vacancy",
                kind: "client",
              },
              {
                id: "hr",
                label: "HR team",
                note: "Runs the pipeline",
                kind: "client",
              },
              {
                id: "cand",
                label: "Candidate",
                note: "No account: applies, then joins by link",
                kind: "client",
              },
            ],
          },
          {
            title: "The service",
            nodes: [
              {
                id: "api",
                label: "Django API",
                note: "Requests, posts, applicants, evaluations",
                kind: "service",
              },
              {
                id: "live",
                label: "WebRTC channel",
                note: "Live updates and notifications",
                kind: "service",
              },
              {
                id: "rtc",
                label: "Stream API",
                note: "Runs the interview call in the browser",
                kind: "service",
              },
            ],
          },
          {
            title: "What it keeps",
            nodes: [
              {
                id: "pg",
                label: "PostgreSQL",
                note: "Request to post to applicant to hire",
                kind: "data",
              },
              {
                id: "files",
                label: "Résumé storage",
                note: "Uploads attached to applicants",
                kind: "data",
              },
              {
                id: "mail",
                label: "Email + OTP",
                note: "Verification and notices",
                kind: "external",
              },
            ],
          },
        ],
        flows: [
          { from: "dm", to: "api", label: "raises request" },
          { from: "hr", to: "api", label: "approves, posts" },
          { from: "cand", to: "api", label: "applies" },
          { from: "cand", to: "rtc", label: "joins interview" },
          { from: "hr", to: "rtc", label: null },
          { from: "api", to: "live", label: "live updates" },
          { from: "api", to: "pg", label: null },
          { from: "api", to: "files", label: null },
          { from: "api", to: "mail", label: null },
        ],
      },
      erd: {
        title: "A vacancy becomes a hire",
        caption:
          "The whole pipeline is one chain of records. A request becomes a post, a post collects applicants, and an applicant carries an interview and an evaluation, so nothing about a candidate lives in somebody's inbox.",
        columns: [
          {
            title: "Who is involved",
            entities: [
              {
                id: "user",
                name: "CustomUser",
                fields: [
                  "email (unique)",
                  "user_type: HR | district manager",
                  "phone",
                  "profile_picture",
                ],
                kind: "core",
              },
              {
                id: "appl",
                name: "Applicant",
                fields: [
                  "first_name / last_name",
                  "email",
                  "resume_file (PDF only)",
                  "status: pending → contacted → candidate",
                  "→ super_candidate → hired",
                  "hired_date",
                ],
                kind: "owned",
              },
            ],
          },
          {
            title: "The pipeline",
            entities: [
              {
                id: "req",
                name: "JobRequest",
                fields: [
                  "field",
                  "required_employees",
                  "experience_level",
                  "status",
                  "district_manager",
                ],
                kind: "owned",
              },
              {
                id: "post",
                name: "JobPost",
                fields: [
                  "job_request (1:1)",
                  "contract_type",
                  "human_resources",
                  "is_active",
                ],
                kind: "owned",
              },
            ],
          },
          {
            title: "What comes of it",
            entities: [
              {
                id: "intv",
                name: "Interview",
                fields: [
                  "meeting_id (UUID room)",
                  "guest_id (UUID, per candidate)",
                  "interviewer",
                  "candidate",
                  "scheduled_time",
                  "status",
                ],
                kind: "owned",
              },
              {
                id: "eval",
                name: "PerformanceEvaluation",
                fields: [
                  "applicant",
                  "technical_skills",
                  "communication",
                  "problem_solving",
                  "leadership",
                ],
                kind: "owned",
              },
              {
                id: "note",
                name: "Notification",
                fields: [
                  "recipient",
                  "sender_type",
                  "notification_type",
                  "is_read",
                ],
                kind: "support",
              },
            ],
          },
        ],
        relations: [
          { from: "user", to: "req", label: "raises many" },
          { from: "req", to: "post", label: "one to one" },
          { from: "post", to: "appl", label: "one to many" },
          { from: "appl", to: "intv", label: "one to many" },
          { from: "appl", to: "eval", label: "one to many" },
          { from: "user", to: "note", label: "one to many" },
        ],
      },
      flow: {
        title: "A vacancy, end to end",
        caption:
          "Two staff roles and a candidate who never gets an account. Every stage moves the applicant's record one notch along a five-state ladder, and the interview happens on a private link that dies with the call.",
        lanes: [
          { id: "dm", label: "District manager" },
          { id: "hr", label: "Human resources" },
          { id: "cand", label: "Candidate" },
          { id: "sys", label: "The system" },
        ],
        steps: [
          {
            id: "s1",
            lane: "dm",
            label: "Raises a staffing request",
            note: "Function, headcount, experience, workplace",
            state: "pending",
            kind: "step",
          },
          {
            id: "s2",
            lane: "hr",
            label: "Reviews and approves it",
            note: null,
            state: "approved",
            kind: "gate",
          },
          {
            id: "s3",
            lane: "hr",
            label: "Publishes the job post",
            note: "One post per approved request",
            state: null,
            kind: "step",
          },
          {
            id: "s4",
            lane: "cand",
            label: "Applies with a PDF CV",
            note: "No account is ever created",
            state: "pending",
            kind: "step",
          },
          {
            id: "s5",
            lane: "hr",
            label: "Shortlists from the pool",
            note: null,
            state: "contacted",
            kind: "gate",
          },
          {
            id: "s6",
            lane: "sys",
            label: "Emails a private room link",
            note: "UUID room, UUID guest, expiring token",
            state: null,
            kind: "step",
          },
          {
            id: "s7",
            lane: "cand",
            label: "Sits the first interview",
            note: "Stream video, in the browser",
            state: "candidate",
            kind: "gate",
          },
          {
            id: "s8",
            lane: "cand",
            label: "Sits the second interview",
            note: "A fresh link, same rules",
            state: "super_candidate",
            kind: "gate",
          },
          {
            id: "s9",
            lane: "hr",
            label: "Hires, then evaluates",
            note: "Eight scored dimensions on the profile",
            state: "hired",
            kind: "end",
          },
        ],
      },
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
        "Flutter · Node.js · PostgreSQL · Prisma · Express · TypeScript · Riverpod · Dio · Hive · Redis · Gemini",
      metric: {
        value: "1",
        label:
          "transaction covers the order, the stock, the cart and the points",
      },
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
          caption: "Options, sizes and extras priced as you choose them.",
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
      diagram: {
        title: "What happens at checkout",
        caption:
          "The phone never decides a price. Order, stock, cart and loyalty all move inside one database transaction, and the push notification is sent only after it commits.",
        columns: [
          {
            title: "Who calls",
            nodes: [
              {
                id: "app",
                label: "Flutter app",
                note: "Guest cart works offline",
                kind: "client",
              },
              {
                id: "fb",
                label: "Firebase Auth",
                note: "Issues the identity token",
                kind: "external",
              },
            ],
          },
          {
            title: "The service",
            nodes: [
              {
                id: "mw",
                label: "Middleware",
                note: "Verifies the token, rate limits",
                kind: "service",
              },
              {
                id: "ctl",
                label: "Controllers",
                note: "Validates every request with Zod",
                kind: "service",
              },
              {
                id: "ord",
                label: "Checkout service",
                note: "Recomputes totals, stock and points",
                kind: "service",
              },
              {
                id: "ai",
                label: "AI barista",
                note: "Answers are tied to real catalogue items",
                kind: "service",
              },
            ],
          },
          {
            title: "What it keeps",
            nodes: [
              {
                id: "pg",
                label: "PostgreSQL",
                note: "One transaction: order, stock, cart, ledger",
                kind: "data",
              },
              {
                id: "redis",
                label: "Redis",
                note: "Catalogue cache, purged on any write",
                kind: "data",
              },
              {
                id: "gem",
                label: "Google Gemini",
                note: "Recommendation text",
                kind: "external",
              },
              {
                id: "fcm",
                label: "Firebase FCM",
                note: "Sent after the commit, never inside it",
                kind: "external",
              },
            ],
          },
        ],
        flows: [
          { from: "app", to: "fb", label: "sign in" },
          { from: "app", to: "mw", label: "bearer token" },
          { from: "mw", to: "ctl", label: null },
          { from: "ctl", to: "ord", label: null },
          { from: "ctl", to: "ai", label: null },
          { from: "ord", to: "pg", label: "single transaction" },
          { from: "ord", to: "redis", label: null },
          { from: "ai", to: "gem", label: null },
          { from: "ord", to: "fcm", label: "after commit" },
        ],
      },
      erd: {
        title: "An order that cannot change under you",
        caption:
          "What you bought is copied onto the order at the moment of purchase: name, image, price and options. The catalogue can be edited afterwards and a delivered order still reads exactly as it did at the till.",
        columns: [
          {
            title: "Who buys",
            entities: [
              {
                id: "user",
                name: "User",
                fields: [
                  "firebaseUid",
                  "email",
                  "displayName",
                  "role",
                  "fcmToken",
                ],
                kind: "core",
              },
              {
                id: "loy",
                name: "LoyaltyAccount",
                fields: [
                  "user (1:1)",
                  "currentPoints",
                  "lifetimePoints",
                  "tier",
                ],
                kind: "owned",
              },
              {
                id: "ledger",
                name: "LoyaltyTransaction",
                fields: ["type", "points", "description"],
                kind: "owned",
              },
            ],
          },
          {
            title: "What is for sale",
            entities: [
              {
                id: "prod",
                name: "Product",
                fields: [
                  "slug",
                  "price (Decimal)",
                  "stock",
                  "type",
                  "avgRating",
                ],
                kind: "core",
              },
              {
                id: "grp",
                name: "ModifierGroup",
                fields: ["name", "selectionType", "isRequired"],
                kind: "support",
              },
              {
                id: "opt",
                name: "ModifierOption",
                fields: ["label", "priceDelta (Decimal)", "isDefault"],
                kind: "support",
              },
            ],
          },
          {
            title: "What was bought",
            entities: [
              {
                id: "order",
                name: "Order",
                fields: [
                  "subtotal / total",
                  "loyaltyDiscount",
                  "pointsEarned",
                  "status",
                  "estimatedReadyAt",
                ],
                kind: "owned",
              },
              {
                id: "item",
                name: "OrderItem",
                fields: [
                  "productName (snapshot)",
                  "unitPrice (snapshot)",
                  "modifiers (JSON)",
                  "quantity",
                ],
                kind: "owned",
              },
              {
                id: "rev",
                name: "Review",
                fields: ["orderItem (1:1)", "rating", "comment", "isVisible"],
                kind: "support",
              },
            ],
          },
        ],
        relations: [
          { from: "user", to: "order", label: "one to many" },
          { from: "user", to: "loy", label: "one to one" },
          { from: "loy", to: "ledger", label: "one to many" },
          { from: "prod", to: "grp", label: "one to many" },
          { from: "grp", to: "opt", label: "one to many" },
          { from: "order", to: "item", label: "one to many" },
          { from: "item", to: "rev", label: "one to one" },
        ],
      },
      flow: {
        title: "From a guest cart to a confirmed order",
        caption:
          "The phone can build a cart with nobody signed in, and none of the numbers it holds are trusted. At checkout the server recomputes all of them and moves four things at once, or moves none of them.",
        lanes: [
          { id: "cust", label: "Customer" },
          { id: "app", label: "Flutter app" },
          { id: "api", label: "API" },
          { id: "db", label: "PostgreSQL" },
        ],
        steps: [
          {
            id: "b1",
            lane: "cust",
            label: "Builds a cart as a guest",
            note: "Kept on the device, survives a restart",
            state: null,
            kind: "step",
          },
          {
            id: "b2",
            lane: "app",
            label: "Signs in with Firebase",
            note: null,
            state: null,
            kind: "step",
          },
          {
            id: "b3",
            lane: "app",
            label: "Replays each local line",
            note: "Merged by product and option set",
            state: null,
            kind: "step",
          },
          {
            id: "b4",
            lane: "cust",
            label: "Picks address, tip and points",
            note: null,
            state: null,
            kind: "step",
          },
          {
            id: "b5",
            lane: "api",
            label: "Revalidates every number",
            note: "What the client sent is an input, not a total",
            state: null,
            kind: "gate",
          },
          {
            id: "b6",
            lane: "db",
            label: "Opens one transaction",
            note: null,
            state: null,
            kind: "step",
          },
          {
            id: "b7",
            lane: "db",
            label: "Order, stock, cart, points",
            note: "All four commit or none of them do",
            state: "CONFIRMED",
            kind: "gate",
          },
          {
            id: "b8",
            lane: "api",
            label: "Sends the confirmation",
            note: "After the commit, never inside it",
            state: null,
            kind: "end",
          },
        ],
      },
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
      hook: "The storefront was the easy half. The ERP behind it is the reason I built this.",
      summary:
        "A storefront with a real back office behind it: nine admin surfaces covering stock, a ten-state order lifecycle, customer records and a sales funnel — the operator's half most shop demos skip.",
      stack: "Django · React · PostgreSQL · Stripe · Channels",
      metric: {
        value: "9",
        label: "back-office surfaces, from stock ledger to sales funnel",
      },
      highlights: [
        "The admin panel is an ERP and a CRM, not a settings page: stock with low-stock thresholds, orders across ten states, promotions, and customer records carrying new, repeat and returning buyers.",
        "Sales leads are measured, not guessed. Every product view, cart add and checkout start is an event, so the funnel down to purchase, average order value, fulfilment and return rates all come out of real traffic.",
        "The full Stripe post-purchase loop lives server-side — payment, order transitions, inventory — and status changes push over WebSockets instead of being polled for.",
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
          caption: "Atomic. The order either exists completely or not at all.",
          fit: "cover",
        },
        {
          src: "/work/FitGuild/ad-analytics.webp",
          alt: "The admin analytics view.",
          caption: "The half most storefront demos skip: the operator's side.",
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
      diagram: {
        title: "How stock stays honest",
        caption:
          "Every movement of stock is written down. The quantity before and after each change is kept, so the number on the shelf can always be explained.",
        columns: [
          {
            title: "Who calls",
            nodes: [
              {
                id: "shop",
                label: "Storefront",
                note: "Browse, cart, checkout",
                kind: "client",
              },
              {
                id: "admin",
                label: "Admin surface",
                note: "Catalogue, orders, analytics",
                kind: "client",
              },
            ],
          },
          {
            title: "The service",
            nodes: [
              {
                id: "api",
                label: "Django API",
                note: "Catalogue, cart, orders",
                kind: "service",
              },
              {
                id: "inv",
                label: "Inventory service",
                note: "Reserves and releases stock",
                kind: "service",
              },
            ],
          },
          {
            title: "What it keeps",
            nodes: [
              {
                id: "pg",
                label: "PostgreSQL",
                note: "Products, variant SKUs, orders",
                kind: "data",
              },
              {
                id: "mv",
                label: "Stock movement ledger",
                note: "Every change, with before and after",
                kind: "data",
              },
              {
                id: "media",
                label: "Media storage",
                note: "Product imagery",
                kind: "data",
              },
            ],
          },
        ],
        flows: [
          { from: "shop", to: "api", label: null },
          { from: "admin", to: "api", label: null },
          { from: "api", to: "inv", label: null },
          { from: "inv", to: "pg", label: null },
          { from: "inv", to: "mv", label: "append-only" },
          { from: "api", to: "media", label: null },
        ],
      },
      erd: {
        title: "Stock that can always be explained",
        caption:
          "A product is not one thing: it is a set of sellable variants, each with its own stock. Every change to that stock is written to a ledger with the quantity before and after, so the number on the shelf is never a mystery.",
        columns: [
          {
            title: "The catalogue",
            entities: [
              {
                id: "prod",
                name: "Product",
                fields: ["title", "slug", "brand", "specs (JSON)", "rating"],
                kind: "core",
              },
              {
                id: "cat",
                name: "Category",
                fields: ["name", "slug", "parent (self)"],
                kind: "support",
              },
              {
                id: "sale",
                name: "Sale",
                fields: [
                  "product (1:1)",
                  "discount_percent",
                  "starts_at / ends_at",
                ],
                kind: "support",
              },
            ],
          },
          {
            title: "What is actually sold",
            entities: [
              {
                id: "sku",
                name: "VariantSKU",
                fields: [
                  "sku",
                  "price",
                  "color / size",
                  "attributes (JSON)",
                  "is_active",
                ],
                kind: "owned",
              },
              {
                id: "inv",
                name: "Inventory",
                fields: ["sku (1:1)", "quantity", "low_stock_threshold"],
                kind: "owned",
              },
            ],
          },
          {
            title: "The paper trail",
            entities: [
              {
                id: "mv",
                name: "StockMovement",
                fields: [
                  "movement_type",
                  "quantity_change",
                  "quantity_before",
                  "quantity_after",
                  "order",
                  "user",
                ],
                kind: "owned",
              },
              {
                id: "ord",
                name: "Order",
                fields: ["user", "address", "status", "total"],
                kind: "core",
              },
            ],
          },
        ],
        relations: [
          { from: "cat", to: "prod", label: "many to many" },
          { from: "prod", to: "sku", label: "one to many" },
          { from: "sku", to: "inv", label: "one to one" },
          { from: "sku", to: "mv", label: "one to many" },
          { from: "ord", to: "mv", label: "one to many" },
          { from: "prod", to: "sale", label: "one to one" },
        ],
      },
      flow: {
        title: "Why the stock number can be trusted",
        caption:
          "Nothing changes stock quietly. Every movement, whether a sale or a manual correction, is written down with the quantity before it and the quantity after, and who caused it.",
        lanes: [
          { id: "shop", label: "Shopper" },
          { id: "api", label: "API" },
          { id: "ledger", label: "Stock ledger" },
          { id: "admin", label: "Back office" },
        ],
        steps: [
          {
            id: "f1",
            lane: "shop",
            label: "Places an order",
            note: null,
            state: null,
            kind: "step",
          },
          {
            id: "f2",
            lane: "api",
            label: "Draws down the SKU",
            note: "Per variant, not per product",
            state: null,
            kind: "step",
          },
          {
            id: "f3",
            lane: "ledger",
            label: "Writes the movement",
            note: "Before, after, and the order behind it",
            state: null,
            kind: "gate",
          },
          {
            id: "f4",
            lane: "admin",
            label: "Sees the real number fall",
            note: null,
            state: null,
            kind: "step",
          },
          {
            id: "f5",
            lane: "admin",
            label: "Restocks or corrects",
            note: "With a reason attached",
            state: null,
            kind: "step",
          },
          {
            id: "f6",
            lane: "ledger",
            label: "Writes that one too",
            note: "Manual changes are not special",
            state: null,
            kind: "gate",
          },
          {
            id: "f7",
            lane: "admin",
            label: "Reconciles from the trail",
            note: "Every figure has a history",
            state: "auditable",
            kind: "end",
          },
        ],
      },
      access: "live site, repo private",
      links: { live: null, source: null },
      todos: [
        "TODO(author): live URL + captures (catalog, variants, order-status mid-update)",
        "TODO(author): source link — repo currently private",
      ],
    },
    {
      slug: "praxisos",
      title: "PraxisOS",
      kind: "product",
      context: "Personal product · solo, ongoing",
      period: "2026",
      hook: "Ten tools' worth of daily tracking in one desktop app — and it never phones home.",
      summary:
        "A local-first command centre for a life: tasks, habits, training, food, focus, money, journal and notes, in one SQLite file with no account and no server.",
      stack:
        "Electron · React · TypeScript · SQLite · Drizzle ORM · Tailwind · shadcn/ui · TanStack Query · Tiptap · Recharts · electron-updater",
      metric: {
        value: "0 servers",
        label:
          "no account, no telemetry — the whole app is one local SQLite file on your machine",
      },
      highlights: [
        "A focus timer that survives closing the window: the app parks in the system tray, and a frameless always-on-top mini widget keeps the running clock in view. Both windows are kept in exact sync by a broadcast from the one process that owns the data, so pausing in either is the same pause.",
        "Every schema change ships a generated SQL migration applied at launch, with foreign keys toggled off on the raw handle around the migrator — Drizzle ignores that pragma inside its own transaction, and without it a table rebuild silently wipes child rows. So an install upgrades in place instead of losing data, and backups export and re-import through a versioned transformer.",
      ],
      cover: {
        src: "/work/PraxisOS/nexus.webp",
        alt: "The PraxisOS dashboard: counters, agenda and a weekly focus chart at a glance.",
        fit: "cover",
      },
      gallery: [
        {
          src: "/work/PraxisOS/nexus.webp",
          alt: "The Nexus dashboard.",
          caption:
            "Everything at a glance: clickable counters that deep-link into each panel, today's agenda, a consistency strip and the week's focus hours.",
          fit: "cover",
        },
        {
          src: "/work/PraxisOS/flow-widget.webp",
          alt: "The focus timer with its pinned mini widget.",
          caption:
            "The timer pops out into a small always-on-top window and keeps counting while you work in another app — the two clocks never drift.",
          fit: "cover",
        },
        {
          src: "/work/PraxisOS/workout-session.webp",
          alt: "A guided workout session.",
          caption:
            "A session engine that walks preview → work → rest per set, with time-based and rep-based exercises and superset handling.",
          fit: "cover",
        },
        {
          src: "/work/PraxisOS/mastery.webp",
          alt: "The Mastery skill tracker.",
          caption:
            "Not just courses — books, projects and deliberate practice too, grouped by the skill area you choose.",
          fit: "cover",
        },
        {
          src: "/work/PraxisOS/codex.webp",
          alt: "The Codex notes editor.",
          caption:
            "Rich text notes with inline images, backed by SQLite full-text search over title, body and tags.",
          fit: "cover",
        },
        {
          src: "/work/PraxisOS/ledger.webp",
          alt: "The Ledger budget panel.",
          caption:
            "Income, expense, transfer and debt, with a spend-by-category chart. The currency sits after the amount, the way it reads locally.",
          fit: "cover",
        },
        {
          src: "/work/PraxisOS/discipline.webp",
          alt: "The Discipline habit matrix.",
          caption:
            "Daily, weekly or custom cadences with streaks. Any past day can be checked in, so training outside the app still counts.",
          fit: "cover",
        },
        {
          src: "/work/PraxisOS/settings-theme.webp",
          alt: "Theme and preset settings.",
          caption:
            "Eight built-in themes plus custom presets that inherit their base theme and change only the accent.",
          fit: "cover",
        },
      ],
      diagram: {
        title: "One process owns the data",
        caption:
          "A three-surface desktop app over a single local database. Every window talks to the main process through a typed, context-isolated bridge; the main process is the only place SQL runs, and it broadcasts each change so the windows never disagree.",
        columns: [
          {
            title: "The surfaces",
            nodes: [
              {
                id: "win",
                label: "Main window",
                note: "Ten panels over one React app",
                kind: "client",
              },
              {
                id: "widget",
                label: "Pinned timer",
                note: "Frameless, always on top",
                kind: "client",
              },
              {
                id: "tray",
                label: "System tray",
                note: "Keeps the app alive in the background",
                kind: "client",
              },
            ],
          },
          {
            title: "The core",
            nodes: [
              {
                id: "ipc",
                label: "Main process",
                note: "Typed IPC — all SQL lives here",
                kind: "service",
              },
              {
                id: "media",
                label: "praxis-media://",
                note: "Custom scheme for local video and images",
                kind: "service",
              },
              {
                id: "upd",
                label: "Auto-updater",
                note: "electron-updater, installs in-app",
                kind: "service",
              },
            ],
          },
          {
            title: "What it keeps",
            nodes: [
              {
                id: "db",
                label: "SQLite",
                note: "One file, 17 tables, via Drizzle",
                kind: "data",
              },
              {
                id: "files",
                label: "Media folder",
                note: "Attached videos, photos, pasted note images",
                kind: "data",
              },
              {
                id: "gh",
                label: "GitHub Releases",
                note: "Update feed (latest.yml) — the only network call",
                kind: "external",
              },
            ],
          },
        ],
        flows: [
          { from: "win", to: "ipc", label: "invoke" },
          { from: "widget", to: "ipc", label: "invoke" },
          { from: "ipc", to: "db", label: null },
          { from: "ipc", to: "files", label: null },
          { from: "win", to: "media", label: "loads media" },
          { from: "media", to: "files", label: "serves" },
          { from: "ipc", to: "win", label: "live sync" },
          { from: "ipc", to: "widget", label: null },
          { from: "upd", to: "gh", label: "checks + installs" },
        ],
      },
      erd: {
        title: "A deliberately flat schema",
        caption:
          "Most panels own one or two tables no other panel reads, which is what keeps a feature change from rippling across the app. Only three real foreign keys exist — the places where a child record has no meaning without its parent.",
        columns: [
          {
            title: "The day",
            entities: [
              {
                id: "task",
                name: "Task",
                fields: [
                  "text",
                  "priority: Eisenhower quadrant",
                  "status: todo → in_progress → completed",
                  "started_at / finished_at",
                ],
                kind: "core",
              },
              {
                id: "habit",
                name: "Habit",
                fields: [
                  "name",
                  "cadence: daily | weekly | custom",
                  "weekdays (JSON)",
                  "streak (derived)",
                ],
                kind: "core",
              },
              {
                id: "hlog",
                name: "HabitLog",
                fields: ["habit_id (FK, cascade)", "date"],
                kind: "owned",
              },
              {
                id: "focus",
                name: "FocusSession",
                fields: [
                  "category",
                  "start_time / end_time",
                  "accumulated_seconds",
                  "status: running | paused | completed",
                ],
                kind: "core",
              },
            ],
          },
          {
            title: "Training & money",
            entities: [
              {
                id: "ex",
                name: "WorkoutExercise",
                fields: [
                  "day",
                  "sets / reps_range",
                  "exercise_type: reps | time",
                  "superset_group",
                  "video_path / image_path",
                ],
                kind: "core",
              },
              {
                id: "wlog",
                name: "WorkoutLog",
                fields: [
                  "exercise_id (FK, cascade)",
                  "set_number",
                  "reps / weight_kg",
                  "date",
                ],
                kind: "owned",
              },
              {
                id: "cat",
                name: "BudgetCategory",
                fields: ["name", "type: income | expense | transfer | debt"],
                kind: "core",
              },
              {
                id: "tx",
                name: "BudgetTransaction",
                fields: [
                  "category_id (FK, set null)",
                  "type",
                  "amount",
                  "date",
                ],
                kind: "owned",
              },
            ],
          },
          {
            title: "Knowledge & config",
            entities: [
              {
                id: "note",
                name: "Note",
                fields: [
                  "title",
                  "content (HTML)",
                  "tags",
                  "FTS5 index, bm25-ranked",
                ],
                kind: "core",
              },
              {
                id: "course",
                name: "Course",
                fields: [
                  "title",
                  "kind: course | book | project | practice",
                  "category (skill area)",
                  "status",
                ],
                kind: "core",
              },
              {
                id: "preset",
                name: "ThemePreset",
                fields: [
                  "base_theme",
                  "accent",
                  "background (null = inherit)",
                  "foreground (null = inherit)",
                ],
                kind: "support",
              },
              {
                id: "settings",
                name: "Settings",
                fields: [
                  "key / value",
                  "theme, font, daily goals",
                  "close_to_tray",
                  "workout schedule",
                ],
                kind: "support",
              },
            ],
          },
        ],
        relations: [
          { from: "habit", to: "hlog", label: "one to many" },
          { from: "ex", to: "wlog", label: "one to many (cascade)" },
          { from: "cat", to: "tx", label: "one to many (set null)" },
        ],
      },
      flow: {
        title: "One write, end to end",
        caption:
          "There are no user roles — it's a single-person tool — so the flow that matters is the technical one: how a click in a panel becomes a durable row, and how every open window learns about it without polling.",
        lanes: [
          { id: "ren", label: "Renderer (React)" },
          { id: "pre", label: "Preload bridge" },
          { id: "main", label: "Main process" },
          { id: "db", label: "SQLite" },
        ],
        steps: [
          {
            id: "s1",
            lane: "ren",
            label: "User acts in a panel",
            note: "e.g. clocks in a focus session",
            state: null,
            kind: "step",
          },
          {
            id: "s2",
            lane: "pre",
            label: "Calls window.api",
            note: "Typed, context-isolated — no Node in the renderer",
            state: null,
            kind: "step",
          },
          {
            id: "s3",
            lane: "main",
            label: "IPC handler runs the SQL",
            note: "The only place SQL lives",
            state: null,
            kind: "gate",
          },
          {
            id: "s4",
            lane: "db",
            label: "Row written",
            note: "better-sqlite3 + Drizzle, synchronous",
            state: null,
            kind: "step",
          },
          {
            id: "s5",
            lane: "main",
            label: "Broadcasts the change",
            note: "To every open window",
            state: null,
            kind: "step",
          },
          {
            id: "s6",
            lane: "ren",
            label: "Windows refetch",
            note: "Main window and pinned widget stay in exact sync",
            state: null,
            kind: "end",
          },
        ],
      },
      access: "personal product, source public on GitHub",
      links: {
        live: "https://praxisos.deviumx.com",
        source: "https://github.com/Lioua-Kyto/PraxisOS",
      },
      todos: [],
    },
  ],
  // 04 — Delivery: the conversion beat. The work above proves what; this
  // proves how it lands and how it is handed over — the part a client or a
  // hiring team is actually buying.
  delivery: {
    heading: "How I ship software.",
    lede: "Whether I'm building for a founder or slotting into an enterprise team, the code has to outlast my involvement. Here is how I make sure it does.",
    practices: [
      {
        title: "Discovery before schema.",
        body: "Code is the easy part; building the wrong thing is expensive. I don't touch a database until we've defined the business logic, the edge cases, and exactly what success looks like for the client.",
      },
      {
        title: "Documentation as a default.",
        body: "I write for the developer who inherits my codebase at 3 AM in two years. From explicit API contracts (Swagger/OpenAPI) to clear, atomic Git commit histories, I make onboarding frictionless.",
      },
      {
        title: "Architected for scale, built for today.",
        body: "I don't over-engineer MVPs, but I don't build traps either. I use pragmatic, scalable patterns — polymorphic models, proper service layers — so the app can grow without a total rewrite.",
      },
      {
        title: "Zero-friction handoffs.",
        body: "When a freelance project is done, it's actually done. I deliver containerized environments (Docker), automated deployment pipelines (CI/CD), and clear operational runbooks.",
      },
    ],
  },
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
        claim: "Local-first, zero servers",
        receipt: "SQLite, offline, no telemetry",
      },
      {
        claim: "Shipped, not just built",
        receipt: "Docker, Nginx, VPS, CI",
      },
      {
        claim: "Polymorphic data models",
        receipt: "one schema, four provider types",
      },
    ],
    // Framed as working disciplines, not a resume dump — each group is how
    // the work is actually organised day to day.
    inventory: [
      {
        group: "Front-End & UI",
        items: [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "GSAP / ScrollTrigger",
          "TanStack Query",
          "Redux",
          "Flutter",
          "Riverpod",
          "i18n / RTL mirroring",
        ],
      },
      {
        group: "Back-End & APIs",
        items: [
          "Django",
          "Django REST Framework",
          "Node.js / Express",
          "Prisma",
          "PostgreSQL",
          "Redis",
          "REST + RBAC",
          "Django Channels",
          "WebSockets",
          "WebRTC",
          "Polymorphic models",
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
          "Firebase (Auth, FCM)",
          "Google Cloud (IAM, OAuth2)",
        ],
      },
      {
        group: "AI-Assisted Engineering",
        items: [
          "Claude Code",
          "Tool-augmented agents",
          "Google Gemini",
          "Prompt + context design",
          "LLM feature integration",
        ],
      },
      {
        group: "Languages",
        items: [
          "Python",
          "TypeScript",
          "JavaScript",
          "Dart",
          "SQL",
          "HTML",
          "CSS",
        ],
      },
      {
        group: "Testing & Tooling",
        items: [
          "PyTest",
          "Jest",
          "Supertest",
          "Playwright",
          "Postman",
          "Swagger / OpenAPI",
          "Zod",
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
    // Read from .env.local, which is gitignored: the repo is public and the
    // number should not live in it. Absent or blank, the WhatsApp link simply
    // is not rendered — see .env.example.
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP?.trim() || undefined,
    todos: [],
  },
};
