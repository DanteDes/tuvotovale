import Image from 'next/image'
import type { Team } from '@/types'

interface ScoreboardProps {
  teams: Team[]
}

function formatVotes(n: number): string {
  return n.toLocaleString('es-AR')
}

export default function Scoreboard({ teams }: ScoreboardProps) {
  const top = teams.slice(0, 4)

  return (
    <div className="scoreboard-panel rounded-xl p-4 w-56 shrink-0">
      {/* Header */}
      <div className="text-center mb-4 border-b border-white/10 pb-3">
        <p
          className="text-[11px] tracking-[0.25em] text-gray-400 uppercase font-semibold"
          style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
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
              <div className="w-7 h-7 rounded-full bg-[#1a2a4a] border border-[#2a3a6a] flex items-center justify-center overflow-hidden shrink-0">
                {team.logo_url ? (
                  <Image src={team.logo_url} alt={team.name} width={28} height={28} className="object-contain" />
                ) : (
                  <span className="text-[10px] font-bold text-[#FFD700]">
                    {team.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span
                className="text-xs text-gray-300 uppercase tracking-wide truncate"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
              >
                {team.name}
              </span>
            </div>

            {/* LED vote count */}
            <p className={`led-number text-right ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
              {formatVotes(team.votes_count)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
