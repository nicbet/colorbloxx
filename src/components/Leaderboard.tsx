import type { HighScore } from "../game/highscores";

interface Props {
  scores: HighScore[];
  highlightRank?: number;
}

export default function Leaderboard({ scores, highlightRank }: Props) {
  if (scores.length === 0) return null;

  return (
    <table className="leaderboard">
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((entry, i) => (
          <tr key={i} className={i === highlightRank ? "highlight" : ""}>
            <td>{entry.initials}</td>
            <td>{entry.score.toLocaleString()}</td>
            <td>{entry.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
