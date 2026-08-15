import type { Diagram } from "@/content/schemas";

/**
 * A project's system map, drawn from data.
 *
 * Layout is derived, not authored: nodes are placed by their column and their
 * index inside it, and every connector is a curve between two computed edges.
 * That keeps the drawing consistent across projects and means it is styled by
 * the site's own tokens rather than arriving as a foreign screenshot.
 *
 * Read left to right, it is the path a request takes: who calls, what receives
 * it, what it talks to. Each node carries one plain-language line so a client
 * can follow the shape while an engineer reads the specifics.
 */

const NODE_W = 178;
const NODE_H = 74;
/** Characters that fit one line of the note at the mono size below. */
const NOTE_CHARS = 27;

/**
 * SVG text does not wrap, so the note is broken into at most two lines here.
 * Anything that still will not fit is cut rather than allowed to run out past
 * the edge of its box.
 */
function wrapNote(note: string): string[] {
  const words = note.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > NOTE_CHARS && line) {
      lines.push(line);
      line = word;
      if (lines.length === 2) break;
    } else {
      line = next;
    }
  }
  if (lines.length < 2 && line) lines.push(line);
  if (lines.length === 2 && lines[1] && lines[1].length > NOTE_CHARS) {
    lines[1] = `${lines[1].slice(0, NOTE_CHARS - 1)}…`;
  }
  return lines;
}
const NODE_GAP = 16;
const COL_GAP = 104;
const PAD_X = 8;
const HEADER_H = 34;

type Placed = {
  x: number;
  y: number;
  node: Diagram["columns"][number]["nodes"][number];
};

function layout(diagram: Diagram) {
  const placed = new Map<string, Placed>();
  const tallest = Math.max(
    ...diagram.columns.map((c) => c.nodes.length * (NODE_H + NODE_GAP)),
  );

  diagram.columns.forEach((column, ci) => {
    const x = PAD_X + ci * (NODE_W + COL_GAP);
    const blockH = column.nodes.length * (NODE_H + NODE_GAP) - NODE_GAP;
    // Columns are centred against each other so the drawing reads as one band
    // rather than a set of lists that happen to sit side by side.
    const top = HEADER_H + (tallest - NODE_GAP - blockH) / 2;
    column.nodes.forEach((node, ni) => {
      placed.set(node.id, { x, y: top + ni * (NODE_H + NODE_GAP), node });
    });
  });

  const width =
    PAD_X * 2 +
    diagram.columns.length * NODE_W +
    (diagram.columns.length - 1) * COL_GAP;
  const height = HEADER_H + tallest + 8;
  return { placed, width, height, tallest };
}

export function SystemMap({ diagram }: { diagram: Diagram }) {
  const { placed, width, height } = layout(diagram);

  return (
    <svg
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      className="system-map"
      role="img"
      aria-label={`${diagram.title}. ${diagram.caption}`}
    >
      {/* Connectors sit under the nodes so a curve never crosses a label. */}
      <g className="system-map-flows">
        {diagram.flows.map((flow) => {
          const from = placed.get(flow.from);
          const to = placed.get(flow.to);
          if (!from || !to) return null;

          const x1 = from.x + NODE_W;
          const y1 = from.y + NODE_H / 2;
          const x2 = to.x;
          const y2 = to.y + NODE_H / 2;
          // Same-column links (a service calling its neighbour) hop out and
          // back rather than drawing a line through the box between them.
          const sameColumn = Math.abs(x2 - (from.x + NODE_W)) > COL_GAP + 1;
          const cx = Math.max(40, Math.abs(x2 - x1) * 0.5);
          const d = sameColumn
            ? `M ${String(from.x + NODE_W)} ${String(y1)} C ${String(from.x + NODE_W + 34)} ${String(y1)}, ${String(x2 - 34)} ${String(y2)}, ${String(x2)} ${String(y2)}`
            : `M ${String(x1)} ${String(y1)} C ${String(x1 + cx)} ${String(y1)}, ${String(x2 - cx)} ${String(y2)}, ${String(x2)} ${String(y2)}`;

          return (
            <g key={`${flow.from}-${flow.to}`}>
              <path d={d} className="system-map-flow" />
              <circle cx={x2} cy={y2} r={2.5} className="system-map-dot" />
              {flow.label ? (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  className="system-map-flow-label"
                  textAnchor="middle"
                >
                  {flow.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>

      {diagram.columns.map((column, ci) => {
        const x = PAD_X + ci * (NODE_W + COL_GAP);
        return (
          <g key={column.title}>
            <text x={x} y={12} className="system-map-column">
              {column.title}
            </text>
            <line
              x1={x}
              y1={20}
              x2={x + NODE_W}
              y2={20}
              className="system-map-rule"
            />
          </g>
        );
      })}

      {[...placed.values()].map(({ x, y, node }) => (
        <g key={node.id} data-kind={node.kind} className="system-map-node">
          <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={2} />
          {/* The accent edge marks what this project actually owns. */}
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={y + NODE_H}
            className="system-map-edge"
          />
          <text x={x + 12} y={y + 24} className="system-map-label">
            {node.label}
          </text>
          {node.note
            ? wrapNote(node.note).map((line, li) => (
                <text
                  key={line}
                  x={x + 12}
                  y={y + 42 + li * 11}
                  className="system-map-note"
                >
                  {line}
                </text>
              ))
            : null}
        </g>
      ))}
    </svg>
  );
}
