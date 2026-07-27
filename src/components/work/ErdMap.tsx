import type { Erd } from "@/content/schemas";

/**
 * A project's data model, drawn in the same language as the system map.
 *
 * Entity boxes size themselves to their field count, columns are centred
 * against each other, and relations are curves labelled with the cardinality
 * said out loud rather than crow's feet a non-engineer has to decode. Fields
 * are a chosen handful, not a schema dump: the point is the shape of the model.
 */

const ENT_W = 196;
const HEAD_H = 26;
const ROW_H = 15;
const ENT_GAP = 20;
const COL_GAP = 116;
const PAD_X = 8;
const HEADER_H = 34;

function height(fieldCount: number) {
  return HEAD_H + fieldCount * ROW_H + 10;
}

export function ErdMap({ erd }: { erd: Erd }) {
  const placed = new Map<
    string,
    {
      x: number;
      y: number;
      h: number;
      col: number;
      entity: Erd["columns"][number]["entities"][number];
    }
  >();

  const columnHeights = erd.columns.map(
    (c) =>
      c.entities.reduce((sum, e) => sum + height(e.fields.length) + ENT_GAP, 0) -
      ENT_GAP,
  );
  const tallest = Math.max(...columnHeights);

  erd.columns.forEach((column, ci) => {
    const x = PAD_X + ci * (ENT_W + COL_GAP);
    let y = HEADER_H + (tallest - (columnHeights[ci] ?? 0)) / 2;
    for (const entity of column.entities) {
      const h = height(entity.fields.length);
      placed.set(entity.id, { x, y, h, col: ci, entity });
      y += h + ENT_GAP;
    }
  });

  const width =
    PAD_X * 2 + erd.columns.length * ENT_W + (erd.columns.length - 1) * COL_GAP;
  const totalH = HEADER_H + tallest + 8;

  return (
    <svg
      viewBox={`0 0 ${String(width)} ${String(totalH)}`}
      className="system-map"
      role="img"
      aria-label={`${erd.title}. ${erd.caption}`}
    >
      <g>
        {erd.relations.map((rel) => {
          const from = placed.get(rel.from);
          const to = placed.get(rel.to);
          if (!from || !to) return null;
          const sameCol = from.col === to.col;
          // A link inside one column has to bow out sideways. It bows left in
          // the last column and right everywhere else, so the curve always has
          // canvas to travel through instead of running off the edge.
          const dir = sameCol && from.col === erd.columns.length - 1 ? -1 : 1;
          const y1 = from.y + from.h / 2;
          const y2 = to.y + to.h / 2;
          const x1 = sameCol
            ? dir === 1
              ? from.x + ENT_W
              : from.x
            : from.x + ENT_W;
          const x2 = sameCol ? (dir === 1 ? to.x + ENT_W : to.x) : to.x;
          const bow = sameCol ? 64 * dir : Math.max(40, Math.abs(x2 - x1) * 0.5);
          const d = sameCol
            ? `M ${String(x1)} ${String(y1)} C ${String(x1 + bow)} ${String(y1)}, ${String(x2 + bow)} ${String(y2)}, ${String(x2)} ${String(y2)}`
            : `M ${String(x1)} ${String(y1)} C ${String(x1 + bow)} ${String(y1)}, ${String(x2 - bow)} ${String(y2)}, ${String(x2)} ${String(y2)}`;
          return (
            <g key={`${rel.from}-${rel.to}`}>
              <path d={d} className="system-map-flow" />
              <circle cx={x2} cy={y2} r={2.5} className="system-map-dot" />
              <text
                x={sameCol ? x1 + bow : (x1 + x2) / 2}
                y={(y1 + y2) / 2 + (sameCol ? 4 : -5)}
                className="system-map-flow-label"
                textAnchor="middle"
              >
                {rel.label}
              </text>
            </g>
          );
        })}
      </g>

      {erd.columns.map((column, ci) => {
        const x = PAD_X + ci * (ENT_W + COL_GAP);
        return (
          <g key={column.title}>
            <text x={x} y={12} className="system-map-column">
              {column.title}
            </text>
            <line x1={x} y1={20} x2={x + ENT_W} y2={20} className="system-map-rule" />
          </g>
        );
      })}

      {[...placed.values()].map(({ x, y, h, entity }) => (
        <g key={entity.id} data-kind={entity.kind} className="erd-entity">
          <rect x={x} y={y} width={ENT_W} height={h} rx={2} />
          {/* The table name sits on its own banded row, the way a schema tool
              would show it, so the fields below read as the table's contents. */}
          <rect x={x} y={y} width={ENT_W} height={HEAD_H} className="erd-head" />
          <text x={x + 11} y={y + 17} className="erd-name">
            {entity.name}
          </text>
          {entity.fields.map((field, fi) => (
            <text
              key={field}
              x={x + 11}
              y={y + HEAD_H + 11 + fi * ROW_H}
              className="erd-field"
            >
              {field}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}
