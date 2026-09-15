import Navbar from '@/components/Navbar'
import VotingSection from '@/components/voting/VotingSection'
import RankingList from '@/components/voting/RankingList'
import type { Team } from '@/types'

// Clásico featured en la home: Boca vs River (superclásico)
// TODO: reemplazar con fetch a Supabase
const SUPERCLASICO: Team[] = [
  { id: '1', name: 'Boca Juniors', slug: 'boca', logo_url: null, votes_count: 421900, created_at: '' },
  { id: '2', name: 'River Plate', slug: 'river', logo_url: null, votes_count: 9321, created_at: '' },
]

// Ranking general — todos los clubes
const ALL_TEAMS: Team[] = [
  { id: '1', name: 'Boca Juniors', slug: 'boca', logo_url: null, votes_count: 421900, created_at: '' },
  { id: '2', name: 'River Plate', slug: 'river', logo_url: null, votes_count: 9321, created_at: '' },
  { id: '3', name: 'Racing Club', slug: 'racing', logo_url: null, votes_count: 7200, created_at: '' },
  { id: '4', name: 'Independiente', slug: 'independiente', logo_url: null, votes_count: 5100, created_at: '' },
  { id: '5', name: 'San Lorenzo', slug: 'san-lorenzo', logo_url: null, votes_count: 3800, created_at: '' },
]

export default async function HomePage() {
  const totalVotes = ALL_TEAMS.reduce((sum, t) => sum + t.votes_count, 0)

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <VotingSection initialTeams={SUPERCLASICO} />
      <RankingList teams={ALL_TEAMS} totalVotes={totalVotes} />
    </main>
  )
}
