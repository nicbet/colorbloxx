import { useState } from "react";
import GameCanvas from "./components/GameCanvas";
import { createBoard } from "./game/board";
import "./App.css";

function App() {
  const [board] = useState(createBoard);

  return (
    <div className="game-container">
      <h1 className="title">
        {"COLORBLOXX".split("").map((char, i) => (
          <span key={i} className={`letter letter-${i}`}>
            {char}
          </span>
        ))}
      </h1>
      <GameCanvas board={board} />
      <div className="instructions">
        <div className="controls">
          <span className="key">←</span><span className="key">→</span> Move
          <span className="sep">|</span>
          <span className="key">↑</span> Rotate
          <span className="sep">|</span>
          <span className="key">↓</span> Drop
        </div>
        <p className="hint">Press START to play</p>
      </div>
    </div>
  );
}

export default App;
