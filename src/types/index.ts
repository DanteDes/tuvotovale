export interface Team {
  id: string
  name: string
  slug: string
  logo_url: string | null
  votes_count: number
  created_at: string
}

export interface Vote {
  id: string
  team_id: string
  payment_id: string
  fingerprint: string | null
  user_id: string | null
  created_at: string
}

export interface Payment {
  id: string
  mp_payment_id: string
  team_id: string
  status: 'pending' | 'approved' | 'rejected'
  amount: number
  fingerprint: string | null
  user_id: string | null
  created_at: string
}

export interface VoteResult {
  teams: Team[]
  totalVotes: number
  leader: Team | null
}
