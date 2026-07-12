import { useState, useRef, useEffect } from "react";
import { saveHighScore, getHighScores, type HighScore } from "../game/highscores";
import Leaderboard from "./Leaderboard";

interface Props {
  score: number;
  onPlayAgain: () => void;
}

export default function GameOver({ score, onPlayAgain }: Props) {
  const [initials, setInitials] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<HighScore[]>([]);
  const [highlightRank, setHighlightRank] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = initials || "AAA";
    const rank = saveHighScore(name, score);
    setScores(getHighScores());
    setHighlightRank(rank);
    setSubmitted(true);
  };

  return (
    <div className="gameover-overlay">
      <div className="gameover-content">
        <h2 className="gameover-title">GAME OVER</h2>
        <p className="gameover-score">
          Score: <strong>{score.toLocaleString()}</strong>
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="gameover-form">
            <label className="gameover-label">Enter your initials</label>
            <input
              ref={inputRef}
              className="gameover-input"
              type="text"
              value={initials}
              onChange={handleChange}
              maxLength={3}
              placeholder="AAA"
            />
            <button type="submit" className="start-button gameover-button">
              SUBMIT
            </button>
          </form>
        ) : (
          <>
            <Leaderboard scores={scores} highlightRank={highlightRank} />
            <button className="start-button gameover-button" onClick={onPlayAgain}>
              PLAY AGAIN
            </button>
          </>
        )}
      </div>
    </div>
  );
}
