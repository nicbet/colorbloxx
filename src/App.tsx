import GameCanvas from "./components/GameCanvas";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboard } from "./hooks/useKeyboard";
import "./App.css";

function App() {
  const { board, player, moveLeft, moveRight, hardDrop } = useGameLoop();

  useKeyboard({ moveLeft, moveRight, hardDrop });

  return (
    <div className="game-container">
      <h1 className="title">
        {"COLORBLOXX".split("").map((char, i) => (
          <span key={i} className={`letter letter-${i}`}>
            {char}
          </span>
        ))}
      </h1>
      <GameCanvas board={board} player={player} />
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
