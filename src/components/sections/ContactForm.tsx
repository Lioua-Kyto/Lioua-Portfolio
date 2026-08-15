"use client";

import { track } from "@/lib/analytics";

const fieldClasses =
  "w-full rounded-xs border border-ink/20 bg-transparent px-3 py-2.5 text-base text-ink placeholder:text-slate/70 focus:border-signal focus:outline-none";

/**
 * The contact form (v3 brief §3.06). No backend exists yet, so submitting
 * composes a prefilled email in the visitor's own mail app — honest and
 * functional with zero infrastructure. Native constraint validation; the
 * direct address sits right beside it as the fallback.
 */
export function ContactForm({ email }: { email: string }) {
  const onSubmit = (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (key: string): string => {
      const value = data.get(key);
      return typeof value === "string" ? value : "";
    };
    const name = field("name");
    const from = field("email");
    const message = field("message");
    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name} · ${from}`);
    // Fired on submit rather than on the button, so it counts a form that
    // actually passed validation — a click on a submit that the browser then
    // rejects for an empty field is not a message sent. Nothing the visitor
    // typed goes with it; the event is the fact that it happened.
    track("contact_submitted");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="contact-name"
          className="font-mono text-label text-slate"
        >
          name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={`mt-1 ${fieldClasses}`}
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="font-mono text-label text-slate"
        >
          email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={`mt-1 ${fieldClasses}`}
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="font-mono text-label text-slate"
        >
          message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className={`mt-1 ${fieldClasses}`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="transition-micro min-h-11 rounded-xs border border-ink/25 px-6 font-mono text-label text-ink transition-colors hover:border-signal hover:text-signal"
        >
          Send
        </button>
        <p className="font-mono text-fine text-slate">
          opens your mail app, or write to {email}
        </p>
      </div>
    </form>
  );
}
