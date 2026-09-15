"use client";

import { useEffect, useRef, useState } from "react";

import { Confetti, type ConfettiRef, getTeamColors } from "@/components/ui/confetti";
import type { Team } from "@/types";

import HinchadaAudio from "./HinchadaAudio";
import ProgressBar from "./ProgressBar";
import Scoreboard from "./Scoreboard";
import TeamCard from "./TeamCard";

interface VotingSectionProps {
  initialTeams: Team[];
}

export default function VotingSection({ initialTeams }: VotingSectionProps) {
  const [teams, _setTeams] = useState<Team[]>(initialTeams);
  const [votedSlug, setVotedSlug] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiRef>(null);

  const sorted = [...teams].sort((a, b) => b.votes_count - a.votes_count);
  const leader = sorted[0];
  const totalVotes = teams.reduce((sum, t) => sum + t.votes_count, 0);

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top1Pct = totalVotes > 0 ? (top1.votes_count / totalVotes) * 100 : 50;
  const top2Pct = totalVotes > 0 ? (top2.votes_count / totalVotes) * 100 : 50;

  // Confetti on mount
  useEffect(() => {
    const t = setTimeout(() => confettiRef.current?.fireSides(), 600);
    return () => clearTimeout(t);
  }, []);

  function handleVote(team: Team) {
    // TODO: redirect to MercadoPago preference
    alert(`Próximamente: pago de $1.000 ARS para votar por ${team.name}`);
    confettiRef.current?.fireSides(getTeamColors(team.slug));
    setVotedSlug(team.slug);
  }

  return (
    <section className="stadium-bg relative flex-1">
      <Confetti ref={confettiRef} />

      <div className="relative z-10 flex flex-col items-center px-4 pt-12 pb-16">
        {/* Leader headline */}
        <div className="mb-10 flex w-full max-w-4xl flex-col items-center text-center">
          <h1 className="leader-title text-5xl text-white drop-shadow-lg md:text-7xl">
            ¡TU VOTO <span className="text-[#FFD700]">VALE!</span>
          </h1>
          {leader && (
            <>
              <p
                className="leader-title mt-3 text-xl md:text-3xl"
                style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
              >
                <span className="text-[#FFD700]">{leader.name.toUpperCase()}</span>
                <span className="text-gray-200"> ES EL REY ACTUAL</span>
              </p>
              {/* Botón de hinchada — colores del equipo líder */}
              <HinchadaAudio slug={votedSlug ?? leader.slug} />
            </>
          )}
        </div>

        {/* Card de batalla + scoreboard: hermanos directos para que items-stretch funcione */}
        <div className="flex w-full max-w-4xl flex-col items-stretch justify-center gap-8 lg:flex-row">
          {/* Voting battle card */}
          <div className="flex w-full flex-1 flex-col justify-center rounded-2xl border border-[#1a3060] bg-[#0a1628cc] p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <TeamCard team={top1} onVote={handleVote} disabled={!!votedSlug} />

              <div className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700] shadow-lg">
                  <span
                    className="font-bold text-[#0a0f1e] text-sm"
                    style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
                  >
                    VS
                  </span>
                </div>
                <ProgressBar team1Name={top1.name} team2Name={top2.name} team1Pct={top1Pct} team2Pct={top2Pct} />
              </div>

              <TeamCard team={top2} onVote={handleVote} disabled={!!votedSlug} />
            </div>

            {votedSlug && <p className="mt-4 text-center text-gray-400 text-sm">Ya registraste tu voto. ¡Gracias!</p>}
          </div>

          {/* Scoreboard — mismo alto que el card gracias a items-stretch */}
          <div className="flex shrink-0 flex-col">
            <Scoreboard teams={sorted} />
          </div>
        </div>

        {/* Nota debajo de ambos */}
        <p className="mt-4 w-full max-w-4xl text-center text-gray-500 text-xs tracking-wider">
          Cada voto tiene un valor de <span className="font-semibold text-[#FFD700]">$1.000 ARS</span>. Solo un voto por
          usuario.
        </p>
      </div>
    </section>
  );
}
