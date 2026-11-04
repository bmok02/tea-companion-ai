"use client";

import type { PersonaId } from "@/lib/personas";

// The companion themself, drawn large beside the brew: the user's own sepia
// illustrations, cut out on a transparent ground. A soft pool of the
// companion's accent light sits behind them and warms while they're
// speaking. Keyed by persona where it's used, so picking someone new brings
// them in fresh. Original has no figure.

export const COMPANION_ART: Record<Exclude<PersonaId, "original">, string> = {
  master: "/companions/master.webp",
  hyrox: "/companions/hyrox.webp",
  exam: "/companions/exam.webp",
  tease: "/companions/tease.webp",
};

interface CompanionFigureProps {
  persona: Exclude<PersonaId, "original">;
  speaking: boolean;
  className: string;
}

export default function CompanionFigure({ persona, speaking, className }: CompanionFigureProps) {
  return (
    <div className={`companion-fig ${className}${speaking ? " speaking" : ""}`} aria-hidden="true">
      <span className="companion-fig-light" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={COMPANION_ART[persona]} alt="" width={900} height={1200} decoding="async" />
    </div>
  );
}
