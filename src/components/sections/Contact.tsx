import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";
import { ContactForm } from "./ContactForm";

/**
 * 06 — Contact (v3 brief §3.06): "Let's build something." A simple form and
 * the real routes. No pricing tables, no services menu.
 */
export function Contact() {
  const { contact, sections } = content;

  return (
    <Section id="contact" index="06" label="Contact">
      <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
        <div>
          <MaskText
            as="h3"
            text={sections.contact.heading}
            className="type-serif block max-w-[14ch] text-headline font-medium"
          />
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
          <p className="mt-6" data-reveal>
            <a
              href="/lioua-zeddam-resume.pdf"
              download
              className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
            >
              download résumé (pdf)
            </a>
          </p>
        </div>

        <div data-reveal>
          <ContactForm email={contact.email} />
        </div>
      </div>
    </Section>
  );
}
