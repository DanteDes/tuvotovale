import Image from 'next/image'
import type { Team } from '@/types'

interface RankingListProps {
  teams: Team[]
  totalVotes: number
}

function formatVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return n.toString()
}

const medals = ['🥇', '🥈', '🥉']

export default function RankingList({ teams, totalVotes }: RankingListProps) {
  const top5 = teams.slice(0, 5)

  return (
    <section className="max-w-4xl mx-auto w-full px-4 pb-16">
      {/* Section header */}
      <div className="rounded-t-xl overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#0a2080] via-[#1a3aaa] to-[#0a2080] px-6 py-3 text-center"
        >
          <h2
            className="text-lg font-bold text-white tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
          >
            Top 5 Clubes Más Votados
          </h2>
        </div>
      </div>

      {/* Ranking rows */}
      <div className="bg-[#0a1220] rounded-b-xl overflow-hidden border border-[#1a2a4a] border-t-0">
        {top5.map((team, index) => {
          const pct = totalVotes > 0 ? ((team.votes_count / totalVotes) * 100).toFixed(1) : '0.0'

          return (
            <div key={team.id} className="ranking-row flex items-center gap-4 px-6 py-4">
              {/* Position */}
              <span
                className="w-8 text-center text-lg font-bold text-[#FFD700] shrink-0"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
              >
                {medals[index] ?? `${index + 1}.`}
              </span>

              {/* Logo */}
              <div className="w-10 h-10 rounded-full bg-[#1a2a4a] border border-[#2a3a6a] flex items-center justify-center overflow-hidden shrink-0">
                {team.logo_url ? (
                  <Image src={team.logo_url} alt={team.name} width={40} height={40} className="object-contain" />
                ) : (
                  <span className="text-xs font-bold text-[#FFD700]">
                    {team.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name */}
              <span
                className="flex-1 text-sm font-semibold text-white uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
              >
                {team.name}
              </span>

              {/* Votes */}
              <span
                className="text-base font-bold text-[#FFD700]"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
              >
                {formatVotes(team.votes_count)}
              </span>

              {/* Percentage */}
              <span className="w-14 text-right text-sm text-gray-400">{pct}%</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
