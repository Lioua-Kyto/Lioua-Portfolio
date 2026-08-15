import type { Flow } from "@/content/schemas";

/**
 * A process drawn as swimlanes: who does what, in the order it happens.
 *
 * Steps run left to right in their party's lane and each connects to the one
 * after it, so a reader follows the story by reading across while the handoffs
 * between parties show up as the diagonal jumps. Where a step leaves a record
 * in a new state, that state is printed on it — the same drawing answers "what
 * happens next" for a client and "what does the row look like now" for an
 * engineer.
 */

const LANE_LABEL_W = 128;
const STEP_W = 172;
const STEP_H = 88;
const STEP_GAP = 38;
const LANE_H = 122;
const HEADER_H = 30;

function wrap(text: string, chars: number, maxLines: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > chars && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = next;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  return lines;
}

export function FlowMap({ flow }: { flow: Flow }) {
  const laneIndex = new Map(flow.lanes.map((lane, i) => [lane.id, i]));

  const placed = flow.steps.map((step, i) => ({
    step,
    x: LANE_LABEL_W + i * (STEP_W + STEP_GAP),
    y: HEADER_H + (laneIndex.get(step.lane) ?? 0) * LANE_H,
  }));

  const width =
    LANE_LABEL_W +
    flow.steps.length * STEP_W +
    (flow.steps.length - 1) * STEP_GAP +
    12;
  const height = HEADER_H + flow.lanes.length * LANE_H;

  return (
    <svg
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      className="system-map"
      role="img"
      aria-label={`${flow.title}. ${flow.caption}`}
    >
      {/* Lane bands first: they are the ground everything else sits on. */}
      {flow.lanes.map((lane, li) => {
        const y = HEADER_H + li * LANE_H;
        return (
          <g key={lane.id}>
            <line x1={0} y1={y} x2={width} y2={y} className="system-map-rule" />
            <text x={0} y={y + 22} className="flow-lane">
              {lane.label}
            </text>
          </g>
        );
      })}

      {/* Connectors run under the cards so a curve never crosses a label. */}
      {placed.map((current, i) => {
        const next = placed[i + 1];
        if (!next) return null;
        const x1 = current.x + STEP_W;
        const y1 = current.y + STEP_H / 2;
        const x2 = next.x;
        const y2 = next.y + STEP_H / 2;
        const bow = Math.max(26, (x2 - x1) * 0.6);
        return (
          <g key={`link-${current.step.id}`}>
            <path
              d={`M ${String(x1)} ${String(y1)} C ${String(x1 + bow)} ${String(y1)}, ${String(x2 - bow)} ${String(y2)}, ${String(x2)} ${String(y2)}`}
              className="system-map-flow"
            />
            <circle cx={x2} cy={y2} r={2.5} className="system-map-dot" />
          </g>
        );
      })}

      {placed.map(({ step, x, y }, i) => (
        <g key={step.id} data-kind={step.kind} className="flow-step">
          <rect x={x} y={y} width={STEP_W} height={STEP_H} rx={2} />
          <text x={x + 11} y={y + 17} className="flow-index">
            {String(i + 1).padStart(2, "0")}
          </text>
          {wrap(step.label, 24, 2).map((line, li) => (
            <text
              key={line}
              x={x + 11}
              y={y + 34 + li * 13}
              className="flow-label"
            >
              {line}
            </text>
          ))}
          {step.note
            ? wrap(step.note, 27, 2).map((line, li) => (
                <text
                  key={line}
                  x={x + 11}
                  y={y + 64 + li * 10}
                  className="flow-note"
                >
                  {line}
                </text>
              ))
            : null}
          {/* The state the record lands in, pinned to the card's own corner. */}
          {step.state ? (
            <text
              x={x + STEP_W - 11}
              y={y + 17}
              className="flow-state"
              textAnchor="end"
            >
              {step.state}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
