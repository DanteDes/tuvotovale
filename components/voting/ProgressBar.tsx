interface ProgressBarProps {
  team1Name: string
  team2Name: string
  team1Pct: number
  team2Pct: number
}

export default function ProgressBar({ team1Name, team2Name, team1Pct, team2Pct }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto">
      {/* Percentage labels */}
      <div className="flex justify-between w-full text-sm font-bold text-gray-300">
        <span style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}>
          {team1Pct.toFixed(0)}%
        </span>
        <span style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}>
          {team2Pct.toFixed(0)}%
        </span>
      </div>

      {/* Bar */}
      <div className="vote-progress-bar w-full h-3">
        <div
          className="vote-progress-fill h-full"
          style={{ width: `${team1Pct}%` }}
        />
      </div>

      {/* Team name labels */}
      <div className="flex justify-between w-full text-[11px] text-gray-500 uppercase tracking-wider">
        <span>{team1Name}</span>
        <span>{team2Name}</span>
      </div>
    </div>
  )
}
