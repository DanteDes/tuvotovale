interface ProgressBarProps {
  team1Name: string;
  team2Name: string;
  team1Pct: number;
  team2Pct: number;
}

export default function ProgressBar({ team1Name, team2Name, team1Pct, team2Pct }: ProgressBarProps) {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-2">
      {/* Percentage labels */}
      <div className="flex w-full justify-between font-bold text-gray-300 text-sm">
        <span style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}>{team1Pct.toFixed(0)}%</span>
        <span style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}>{team2Pct.toFixed(0)}%</span>
      </div>

      {/* Bar */}
      <div className="vote-progress-bar h-3 w-full">
        <div className="vote-progress-fill h-full" style={{ width: `${team1Pct}%` }} />
      </div>

      {/* Team name labels */}
      <div className="flex w-full justify-between text-[11px] text-gray-500 uppercase tracking-wider">
        <span>{team1Name}</span>
        <span>{team2Name}</span>
      </div>
    </div>
  );
}
