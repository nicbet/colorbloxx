import type { HighScore } from "../game/highscores";

interface Props {
  scores: HighScore[];
  highlightRank?: number;
}

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

function padScore(score: number): string {
  return String(score).padStart(7, "0");
}

export default function Leaderboard({ scores, highlightRank }: Props) {
  if (scores.length === 0) return null;

  return (
    <div className="leaderboard">
      <div className="lb-header">HIGH SCORES</div>
      {scores.map((entry, i) => (
        <div
          key={i}
          className={`lb-row${i === highlightRank ? " lb-highlight" : ""}`}
          style={{ color: RANK_COLORS[i] ?? "#888" }}
        >
          <span className="lb-rank">{String(i + 1).padStart(2, " ")}.</span>
          <span className="lb-name">{entry.initials}</span>
          <span className="lb-score">{padScore(entry.score)}</span>
        </div>
      ))}
    </div>
  );
}
