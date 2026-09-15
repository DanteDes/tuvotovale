import Image from "next/image";

import type { Team } from "@/types";

interface RankingListProps {
  teams: Team[];
  totalVotes: number;
}

function formatVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
}

const medals = ["🥇", "🥈", "🥉"];

export default function RankingList({ teams, totalVotes }: RankingListProps) {
  const top5 = teams.slice(0, 5);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-16">
      {/* Section header */}
      <div className="overflow-hidden rounded-t-xl">
        <div className="bg-gradient-to-r from-[#0a2080] via-[#1a3aaa] to-[#0a2080] px-6 py-3 text-center">
          <h2
            className="font-bold text-lg text-white uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
          >
            Top 5 Clubes Más Votados
          </h2>
        </div>
      </div>

      {/* Ranking rows */}
      <div className="overflow-hidden rounded-b-xl border border-[#1a2a4a] border-t-0 bg-[#0a1220]">
        {top5.map((team, index) => {
          const pct = totalVotes > 0 ? ((team.votes_count / totalVotes) * 100).toFixed(1) : "0.0";

          return (
            <div key={team.id} className="ranking-row flex items-center gap-4 px-6 py-4">
              {/* Position */}
              <span
                className="w-8 shrink-0 text-center font-bold text-[#FFD700] text-lg"
                style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
              >
                {medals[index] ?? `${index + 1}.`}
              </span>

              {/* Logo */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#2a3a6a] bg-[#1a2a4a]">
                {team.logo_url ? (
                  <Image src={team.logo_url} alt={team.name} width={40} height={40} className="object-contain" />
                ) : (
                  <span className="font-bold text-[#FFD700] text-xs">{team.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              {/* Name */}
              <span
                className="flex-1 font-semibold text-sm text-white uppercase tracking-wide"
                style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
              >
                {team.name}
              </span>

              {/* Votes */}
              <span
                className="font-bold text-[#FFD700] text-base"
                style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
              >
                {formatVotes(team.votes_count)}
              </span>

              {/* Percentage */}
              <span className="w-14 text-right text-gray-400 text-sm">{pct}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
