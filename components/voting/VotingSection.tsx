'use client'

import { useEffect, useRef, useState } from 'react'
import type { Team } from '@/types'
import { Confetti, type ConfettiRef, getTeamColors } from '@/components/ui/confetti'
import TeamCard from './TeamCard'
import ProgressBar from './ProgressBar'
import Scoreboard from './Scoreboard'
import HinchadaAudio from './HinchadaAudio'

interface VotingSectionProps {
  initialTeams: Team[]
}

export default function VotingSection({ initialTeams }: VotingSectionProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [votedSlug, setVotedSlug] = useState<string | null>(null)
  const confettiRef = useRef<ConfettiRef>(null)

  const sorted = [...teams].sort((a, b) => b.votes_count - a.votes_count)
  const leader = sorted[0]
  const totalVotes = teams.reduce((sum, t) => sum + t.votes_count, 0)

  const top1 = sorted[0]
  const top2 = sorted[1]
  const top1Pct = totalVotes > 0 ? (top1.votes_count / totalVotes) * 100 : 50
  const top2Pct = totalVotes > 0 ? (top2.votes_count / totalVotes) * 100 : 50

  // Confetti on mount
  useEffect(() => {
    const t = setTimeout(() => confettiRef.current?.fireSides(), 600)
    return () => clearTimeout(t)
  }, [])

  function handleVote(team: Team) {
    // TODO: redirect to MercadoPago preference
    alert(`Próximamente: pago de $1.000 ARS para votar por ${team.name}`)
    confettiRef.current?.fireSides(getTeamColors(team.slug))
    setVotedSlug(team.slug)
  }

  return (
    <section className="stadium-bg relative flex-1">
      <Confetti ref={confettiRef} />

      <div className="relative z-10 flex flex-col items-center px-4 pt-12 pb-16">
        {/* Leader headline */}
        <div className="text-center mb-10 w-full max-w-4xl flex flex-col items-center">
          <h1 className="leader-title text-5xl md:text-7xl text-white drop-shadow-lg">
            ¡TU VOTO <span className="text-[#FFD700]">VALE!</span>
          </h1>
          {leader && (
            <>
              <p
                className="leader-title text-xl md:text-3xl mt-3"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
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
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 w-full max-w-4xl">

          {/* Voting battle card */}
          <div className="flex-1 w-full bg-[#0a1628cc] backdrop-blur-sm rounded-2xl p-6 border border-[#1a3060] flex flex-col justify-center">
            <div className="flex items-center justify-between gap-4">
              <TeamCard team={top1} onVote={handleVote} disabled={!!votedSlug} />

              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg">
                  <span
                    className="text-sm font-bold text-[#0a0f1e]"
                    style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
                  >
                    VS
                  </span>
                </div>
                <ProgressBar
                  team1Name={top1.name}
                  team2Name={top2.name}
                  team1Pct={top1Pct}
                  team2Pct={top2Pct}
                />
              </div>

              <TeamCard team={top2} onVote={handleVote} disabled={!!votedSlug} />
            </div>

            {votedSlug && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Ya registraste tu voto. ¡Gracias!
              </p>
            )}
          </div>

          {/* Scoreboard — mismo alto que el card gracias a items-stretch */}
          <div className="shrink-0 flex flex-col">
            <Scoreboard teams={sorted} />
          </div>
        </div>

        {/* Nota debajo de ambos */}
        <p className="text-gray-500 text-xs tracking-wider text-center mt-4 w-full max-w-4xl">
          Cada voto tiene un valor de <span className="text-[#FFD700] font-semibold">$1.000 ARS</span>. Solo un voto por usuario.
        </p>
      </div>
    </section>
  )
}
