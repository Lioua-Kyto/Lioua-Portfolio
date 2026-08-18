import { z } from "zod";
import { content } from "@/content";

/**
 * The contact form's endpoint.
 *
 * It replaced a `mailto:` link, which was honest about having no backend but
 * only worked for readers whose machine had a mail client registered. On a
 * browser with no handler the navigation is discarded silently, so the form
 * appeared to do nothing at all — which is the worst version of not working,
 * because the sender believes the message went.
 *
 * Resend over plain `fetch` rather than its SDK: the request is one POST with
 * a bearer token, and the app is deliberately kept to a short dependency list.
 */

const payloadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(1).max(5000),
  /**
   * Honeypot. Left empty by people, filled by the bots that read the DOM.
   * Accepts any string on purpose: rejecting a filled one here would 400
   * before the trap below ever runs, which tells the sender exactly which
   * field caught them. It is validated by being ignored.
   */
  company: z.string().max(200).optional(),
});

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] ?? c,
  );

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the fields and try again." },
      { status: 400 },
    );
  }

  // A filled honeypot gets a 200 and goes nowhere. Answering honestly would
  // only teach the sender which field gave it away.
  if (parsed.data.company) return Response.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json(
      { error: "The form is not configured yet. Email me directly instead." },
      { status: 503 },
    );
  }

  const { name, email, message } = parsed.data;
  const to = process.env.CONTACT_TO ?? content.contact.email;
  const from = process.env.CONTACT_FROM ?? "onboarding@resend.dev";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Portfolio <${from}>`,
      to: [to],
      // The sender's own address, so hitting reply in the mail client goes to
      // them rather than back to the sending domain.
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `${message}\n\n---\n${name}\n${email}`,
      html: `<p>${escape(message).replace(/\n/g, "<br>")}</p><hr><p>${escape(name)}<br>${escape(email)}</p>`,
    }),
  });

  if (!response.ok) {
    return Response.json(
      { error: "The message could not be sent. Email me directly instead." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
