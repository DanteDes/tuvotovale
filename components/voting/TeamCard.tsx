import Image from 'next/image'
import type { Team } from '@/types'

interface TeamCardProps {
  team: Team
  onVote: (team: Team) => void
  side: 'left' | 'right'
  disabled?: boolean
}

export default function TeamCard({ team, onVote, side, disabled }: TeamCardProps) {
  const isLeft = side === 'left'

  return (
    <div className={`flex flex-col items-center gap-4 ${isLeft ? 'items-start md:items-center' : 'items-end md:items-center'}`}>
      {/* Team logo */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1a2a4a] border-2 border-[#2a3a6a] flex items-center justify-center overflow-hidden shadow-lg">
        {team.logo_url ? (
          <Image src={team.logo_url} alt={team.name} width={96} height={96} className="object-contain" />
        ) : (
          <span
            className="text-3xl font-bold text-[#FFD700]"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
          >
            {team.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Team name */}
      <p
        className="text-sm text-gray-300 tracking-wider uppercase text-center"
        style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
      >
        {team.name}
      </p>

      {/* Vote button */}
      <button
        onClick={() => onVote(team)}
        disabled={disabled}
        className={`
          px-6 py-3 rounded text-sm cursor-pointer
          ${isLeft ? 'btn-gold' : 'btn-outline'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        VOTAR POR {team.name.toUpperCase()}
      </button>
    </div>
  )
}
