import { useState, useRef, useEffect } from "react";

interface Props {
  score: number;
  onSubmit: (initials: string) => void;
}

export default function GameOver({ score, onSubmit }: Props) {
  const [initials, setInitials] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(initials || "AAA");
  };

  return (
    <div className="gameover-overlay">
      <div className="gameover-content">
        <h2 className="gameover-title">GAME OVER</h2>
        <p className="gameover-score">
          Score: <strong>{score.toLocaleString()}</strong>
        </p>
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
            PLAY AGAIN
          </button>
        </form>
      </div>
    </div>
  );
}
