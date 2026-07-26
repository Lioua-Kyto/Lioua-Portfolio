import { ImageResponse } from "next/og";
import { content } from "@/content";
import { fetchGoogleFont } from "@/lib/og/fonts";

export const runtime = "edge";
export const alt = "Lioua Zeddam · Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Paper palette mirror — satori can't read CSS custom props.
const paper = "#f4f1ea";
const ink = "#14140f";
const slate = "#6b6559";
const signal = "#a63c26";

/** Editorial OG card (v3 brief §7, Phase 4): paper ground, serif name, mono
 * label, the three proof numbers. */
export default async function OpengraphImage() {
  const [serif, mono] = await Promise.all([
    fetchGoogleFont("Fraunces", 600),
    fetchGoogleFont("Martian Mono", 500),
  ]);
  const fonts = [
    serif ? { name: "Fraunces", data: serif, weight: 600 as const } : null,
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
            fontFamily: "Fraunces, serif",
            fontSize: 128,
            color: ink,
            lineHeight: 1,
          }}
        >
          {intro.name}
        </div>
        <div style={{ marginTop: 20, fontSize: 30, color: slate }}>
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
                fontFamily: "Fraunces, serif",
                fontSize: 40,
                color: signal,
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
