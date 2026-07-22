import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Label } from "@/components/primitives/Label";
import { ContactForm } from "./ContactForm";

/**
 * 06 — Contact (v3 brief §3.06): "Let's build something." A simple form and
 * the real routes. No pricing tables, no services menu.
 */
export function Contact() {
  const { contact } = content;

  return (
    <Section id="contact" index="06" label="Contact">
      <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
        <div>
          <h3
            data-reveal
            className="type-serif max-w-[14ch] text-headline font-medium"
          >
            Let&apos;s build something.
          </h3>
          <ul className="mt-10 max-w-md" data-reveal>
            <li className="hairline">
              <a
                href={`mailto:${contact.email}`}
                className="transition-micro block py-3 font-mono text-label text-ink transition-colors hover:text-signal"
              >
                {contact.email}
              </a>
            </li>
            <li className="hairline">
              <a
                href={`https://${contact.linkedin}`}
                rel="me noopener"
                className="transition-micro block py-3 font-mono text-label text-ink transition-colors hover:text-signal"
              >
                {contact.linkedin}
              </a>
            </li>
            <li className="hairline">
              <a
                href={`https://${contact.github}`}
                rel="me noopener"
                className="transition-micro block py-3 font-mono text-label text-ink transition-colors hover:text-signal"
              >
                {contact.github}
              </a>
            </li>
            <li className="hairline border-b border-b-ink/14 py-3">
              <Label>{contact.phone}</Label>
            </li>
          </ul>
          <p className="mt-6">
            <Label>resume pdf — on its way</Label>
          </p>
        </div>

        <div data-reveal>
          <ContactForm email={contact.email} />
        </div>
      </div>
    </Section>
  );
}
