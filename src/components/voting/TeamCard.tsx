import Image from 'next/image'
import type { Team } from '@/types'

interface TeamStyle {
  logoBg: string
  logoText: string
  btnBg: string
  btnText: string
  btnBorder: string
}

const TEAM_STYLES: Record<string, TeamStyle> = {
  boca: {
    logoBg: '#003f8a',
    logoText: '#FFD700',
    btnBg: '#003f8a',
    btnText: '#FFD700',
    btnBorder: '#FFD700',
  },
  river: {
    logoBg: '#CC0000',
    logoText: '#ffffff',
    btnBg: '#CC0000',
    btnText: '#ffffff',
    btnBorder: '#CC0000',
  },
}

const DEFAULT_STYLE: TeamStyle = {
  logoBg: '#1a2a4a',
  logoText: '#FFD700',
  btnBg: '#FFD700',
  btnText: '#0a0f1e',
  btnBorder: '#FFD700',
}

function getStyle(slug: string): TeamStyle {
  return TEAM_STYLES[slug] ?? DEFAULT_STYLE
}

interface TeamCardProps {
  team: Team
  onVote: (team: Team) => void
  disabled?: boolean
}

export default function TeamCard({ team, onVote, disabled }: TeamCardProps) {
  const s = getStyle(team.slug)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Team logo */}
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-lg"
        style={{ backgroundColor: s.logoBg, borderColor: s.btnBorder }}
      >
        {team.logo_url ? (
          <Image src={team.logo_url} alt={team.name} width={96} height={96} className="object-contain" />
        ) : (
          <span
            className="text-3xl font-bold"
            style={{ color: s.logoText, fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
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
        className="px-6 py-3 rounded text-sm font-bold cursor-pointer uppercase tracking-widest border-2 transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: s.btnBg,
          color: s.btnText,
          borderColor: s.btnBorder,
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
        }}
      >
        VOTAR POR {team.name.toUpperCase()}
      </button>
    </div>
  )
}
