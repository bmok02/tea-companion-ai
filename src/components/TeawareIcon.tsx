import type { TeawareIcon } from "@/lib/teaware";

// Stand-in drawings for the checklist until product photos are added
// (TeawareItem.image). Same palette as the brew scene.
const STROKE = { fill: "none", stroke: "var(--gold-deep)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export default function TeawareIconArt({ icon }: { icon: TeawareIcon }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      {icon === "gaiwan" && (
        <g {...STROKE}>
          <path d="M12 28 L20 50 Q32 54 44 50 L52 28 Z" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M14 28 Q32 14 50 28" />
          <circle cx="32" cy="17" r="2.5" />
          <path d="M18 54 H46" />
        </g>
      )}
      {icon === "pitcher" && (
        <g {...STROKE}>
          <path d="M18 14 H42 L40 48 Q30 52 20 48 Z" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M42 20 Q54 20 52 32 Q50 40 41 40" />
          <path d="M18 14 L12 11" />
        </g>
      )}
      {icon === "cups" && (
        <g {...STROKE}>
          <path d="M8 26 H30 L28 42 Q19 46 10 42 Z" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M34 30 H54 L52 44 Q44 48 36 44 Z" fill="var(--bamboo)" fillOpacity="0.3" />
        </g>
      )}
      {icon === "tray" && (
        <g {...STROKE}>
          <rect x="8" y="30" width="48" height="14" rx="3" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M16 30 V44 M24 30 V44 M32 30 V44 M40 30 V44 M48 30 V44" />
          <path d="M12 48 V54 M52 48 V54" />
        </g>
      )}
      {icon === "kettle" && (
        <g {...STROKE}>
          <path d="M16 26 Q14 50 22 50 H40 Q48 50 46 26 Z" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M16 30 L8 22" />
          <path d="M22 26 Q31 10 42 26" />
          <path d="M24 14 Q22 10 26 8 M32 14 Q30 10 34 8" strokeOpacity="0.6" />
        </g>
      )}
      {icon === "filterpot" && (
        <g {...STROKE}>
          <path d="M18 26 Q12 42 22 52 Q32 56 42 52 Q52 42 46 26 Z" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M18 32 L8 24" />
          <path d="M20 26 Q32 14 44 26" />
          <rect x="29" y="13" width="6" height="4" rx="1.5" />
          <path d="M16 36 H48" strokeOpacity="0.6" />
          <path d="M24 30 Q24 46 32 48 Q40 46 40 30" strokeDasharray="2 2.5" strokeOpacity="0.7" />
        </g>
      )}
      {icon === "glasspitcher" && (
        <g {...STROKE} stroke="var(--ink-muted)">
          <path d="M18 18 H44 L41 50 Q31 54 21 50 Z" fill="white" fillOpacity="0.06" />
          <path d="M18 18 L12 15" />
          <path d="M23 24 L25 44" strokeOpacity="0.5" />
        </g>
      )}
      {icon === "bowl" && (
        <g {...STROKE}>
          <path d="M10 30 H54 Q52 48 32 50 Q12 48 10 30 Z" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M22 54 H42" />
        </g>
      )}
      {icon === "case" && (
        <g {...STROKE}>
          <rect x="10" y="24" width="44" height="26" rx="5" fill="var(--bamboo)" fillOpacity="0.3" />
          <path d="M24 24 V18 H40 V24" />
          <path d="M10 36 H54" />
        </g>
      )}
      {icon === "leaves" && (
        <g {...STROKE}>
          <path d="M14 40 Q22 24 34 30 Q30 44 14 40 Z" fill="#6f7d3a" fillOpacity="0.5" />
          <path d="M30 24 Q40 10 52 18 Q46 32 30 24 Z" fill="#59652c" fillOpacity="0.5" />
          <path d="M34 50 Q42 36 54 42 Q48 54 34 50 Z" fill="#6f7d3a" fillOpacity="0.5" />
        </g>
      )}
      {icon === "teabag" && (
        <g {...STROKE}>
          <path d="M22 28 Q24 22 32 21 Q40 22 42 28 L40 48 Q32 52 24 48 Z" fill="#d8caa4" />
          <path d="M32 21 Q36 10 48 12" />
          <rect x="46" y="10" width="9" height="12" rx="1.5" fill="var(--bamboo-pale)" />
        </g>
      )}
    </svg>
  );
}
