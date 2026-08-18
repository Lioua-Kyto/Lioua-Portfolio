"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const fieldClasses =
  "w-full rounded-xs border border-ink/20 bg-transparent px-3 py-2.5 text-base text-ink placeholder:text-slate/70 focus:border-signal focus:outline-none disabled:opacity-60";

type State = "idle" | "sending" | "sent" | "error";

/**
 * The contact form.
 *
 * It used to hand off to `mailto:`, which was honest about there being no
 * backend but only worked for readers whose machine had a mail client
 * registered. Everyone else pressed Send and watched nothing happen, believing
 * the message had gone. It posts to `/api/contact` now, so the outcome is
 * something the form actually knows and can say out loud.
 */
export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const revert = useRef<number | undefined>(undefined);

  // The success state is a moment, not a destination: it holds long enough to
  // be read and then the form is ready again. Cleared on unmount so a reader
  // who navigates away mid-flight does not land a state update on nothing.
  useEffect(
    () => () => {
      window.clearTimeout(revert.current);
    },
    [],
  );

  // Structurally typed rather than `React.FormEvent`, which these React
  // types mark deprecated. This is everything the handler actually touches.
  const onSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) => {
    event.preventDefault();
    if (state === "sending") return;

    const data = new FormData(event.currentTarget);
    const value = (key: string) => {
      const v = data.get(key);
      return typeof v === "string" ? v : "";
    };

    setState("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          email: value("email"),
          message: value("message"),
          company: value("company"),
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(body.error ?? "Something went wrong. Try again in a moment.");
        setState("error");
        return;
      }

      // Counted here rather than on the button: a click the browser then
      // rejects for an empty field is not a message sent, and neither is one
      // the server refused. Nothing typed goes with the event.
      track("contact_submitted");
      form.current?.reset();
      setState("sent");
      revert.current = window.setTimeout(() => {
        setState("idle");
      }, 2600);
    } catch {
      setError("No connection. Email me directly instead.");
      setState("error");
    }
  };

  const busy = state === "sending";

  return (
    <form
      ref={form}
      onSubmit={(event) => {
        void onSubmit(event);
      }}
      className="space-y-5"
    >
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
          disabled={busy}
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
          disabled={busy}
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
          disabled={busy}
          className={`mt-1 ${fieldClasses}`}
        />
      </div>

      {/* Honeypot: off-screen rather than display:none, which some bots skip,
          and out of the tab order and the accessibility tree so no person
          ever meets it. */}
      <div aria-hidden="true" className="contact-trap">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          data-state={state}
          className="contact-send transition-micro min-h-11 rounded-xs border border-ink/25 px-6 font-mono text-label text-ink transition-colors hover:border-signal hover:text-signal"
        >
          {state === "sending" ? (
            <>
              <span className="contact-spinner" aria-hidden="true" />
              <span className="sr-only">Sending</span>
            </>
          ) : state === "sent" ? (
            "Sent"
          ) : (
            "Send"
          )}
        </button>

        {/* One line, whatever it has to say. `aria-live` so the outcome reaches
            a screen reader too, since the button's own label change is easy to
            miss when focus has already moved on. */}
        <p
          aria-live="polite"
          className={`font-mono text-fine ${state === "error" ? "text-err" : "text-slate"}`}
        >
          {state === "sent"
            ? "Message sent. I'll come back to you."
            : (error ?? `or write to ${email}`)}
        </p>
      </div>
    </form>
  );
}
