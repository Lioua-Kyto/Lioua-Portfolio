import { ImageResponse } from "next/og";
import { content } from "@/content";
import { fetchGoogleFont } from "@/lib/og/fonts";

// Node, not edge: on edge this route cannot be statically generated, and it
// renders the same picture on every request.
export const runtime = "nodejs";
export const alt = "Lioua Zeddam · Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette mirror — satori cannot read CSS custom properties, so these track
// tokens.css by hand. Cobalt on neutral paper, which is what the site has been
// since the redesign; this card had been left on the old amber.
const paper = "#f2f2f0";
const ink = "#14141a";
const slate = "#63636b";
const accent = "#2b4ecc";

/** Editorial OG card (v3 brief §7, Phase 4): paper ground, serif name, mono
 * label, the three proof numbers. */
export default async function OpengraphImage() {
  const [display, mono] = await Promise.all([
    fetchGoogleFont("Bricolage Grotesque", 800),
    fetchGoogleFont("Martian Mono", 500),
  ]);
  const fonts = [
    display
      ? { name: "Bricolage Grotesque", data: display, weight: 800 as const }
      : null,
    mono ? { name: "Martian Mono", data: mono, weight: 500 as const } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  const { intro } = content;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: paper,
        padding: 72,
        fontFamily: "Martian Mono, monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 24, color: slate }}>
        00 · {intro.role}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            color: accent,
            lineHeight: 0.92,
          }}
        >
          {intro.name}
        </div>
        <div style={{ marginTop: 22, fontSize: 30, color: ink }}>
          {intro.line}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 72,
          borderTop: `1px solid ${ink}22`,
          paddingTop: 28,
        }}
      >
        {intro.proofs.map((proof) => (
          <div
            key={proof.label}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <span
              style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontSize: 40,
                color: accent,
              }}
            >
              {proof.value}
            </span>
            <span style={{ fontSize: 22, color: slate, marginTop: 6 }}>
              {proof.label}
            </span>
          </div>
        ))}
      </div>
    </div>,
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
