import Image from "next/image";

import type { Team } from "@/types";

interface ScoreboardProps {
  teams: Team[];
}

const LOGO_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  boca: { bg: "#003f8a", text: "#FFD700", border: "#FFD700" },
  river: { bg: "#CC0000", text: "#ffffff", border: "#CC0000" },
};
const DEFAULT_LOGO = { bg: "#1a2a4a", text: "#FFD700", border: "#2a3a6a" };

function getLogoStyle(slug: string) {
  return LOGO_STYLES[slug] ?? DEFAULT_LOGO;
}

function formatVotes(n: number): string {
  return n.toLocaleString("es-AR");
}

export default function Scoreboard({ teams }: ScoreboardProps) {
  const top = teams.slice(0, 4);

  return (
    <div className="scoreboard-panel flex h-full w-56 flex-col rounded-xl p-4">
      {/* Header */}
      <div className="mb-4 border-white/10 border-b pb-3 text-center">
        <p
          className="font-semibold text-[11px] text-gray-400 uppercase tracking-[0.25em]"
          style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
        >
          VOTOS ACTUALES
        </p>
      </div>

      {/* Team rows */}
      <div className="flex flex-col gap-4">
        {top.map((team, i) => (
          <div key={team.id} className="flex flex-col gap-1">
            {/* Team identity */}
            <div className="flex items-center gap-2">
              {(() => {
                const s = getLogoStyle(team.slug);
                return (
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border"
                    style={{ backgroundColor: s.bg, borderColor: s.border }}
                  >
                    {team.logo_url ? (
                      <Image src={team.logo_url} alt={team.name} width={28} height={28} className="object-contain" />
                    ) : (
                      <span className="font-bold text-[10px]" style={{ color: s.text }}>
                        {team.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                );
              })()}
              <span
                className="truncate text-gray-300 text-xs uppercase tracking-wide"
                style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
              >
                {team.name}
              </span>
            </div>

            {/* LED vote count */}
            <p className={`led-number text-right ${i === 0 ? "text-2xl" : "text-lg"}`}>
              {formatVotes(team.votes_count)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
