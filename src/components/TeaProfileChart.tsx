"use client";

import { FlavorAxis } from "@/lib/teaVisuals";

interface TeaProfileChartProps {
  axes: FlavorAxis[];
  color: string;
}

const SIZE = 180;
const CENTER = SIZE / 2;
const MAX_R = 58;
const MAX_VAL = 5;
const RING_LEVELS = [1, 2, 3, 4, 5];

function pointFor(i: number, total: number, r: number): [number, number] {
  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

export default function TeaProfileChart({ axes, color }: TeaProfileChartProps) {
  const n = axes.length;
  const valuePoints = axes
    .map((a, i) => pointFor(i, n, (a.value / MAX_VAL) * MAX_R))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const label = axes.map((a) => `${a.label} ${a.value} of 5`).join(", ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="tea-profile-chart"
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label={`Flavour profile: ${label}`}
    >
      {RING_LEVELS.map((lvl) => {
        const r = (lvl / MAX_VAL) * MAX_R;
        const pts = axes.map((_, i) => pointFor(i, n, r).join(",")).join(" ");
        return <polygon key={lvl} points={pts} className="tea-profile-ring" />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pointFor(i, n, MAX_R);
        return <line key={a.key} x1={CENTER} y1={CENTER} x2={x} y2={y} className="tea-profile-spoke" />;
      })}
      <polygon points={valuePoints} className="tea-profile-fill" style={{ fill: color, stroke: color }} />
      {axes.map((a, i) => {
        const [x, y] = pointFor(i, n, MAX_R + 17);
        // Labels left of centre grow rightward (toward the chart) and
        // labels right of centre grow leftward, so the outermost labels —
        // the ones closest to the viewBox edge — extend inward instead of
        // off the edge. Only the top/bottom labels stay centred.
        const anchor = Math.abs(x - CENTER) < 1 ? "middle" : x < CENTER ? "start" : "end";
        return (
          <text
            key={a.key}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="tea-profile-label"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
