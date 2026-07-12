import GameCanvas from "./components/GameCanvas";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboard } from "./hooks/useKeyboard";
import "./App.css";

function App() {
  const { board, player, gameState, moveLeft, moveRight, hardDrop, startGame } =
    useGameLoop();

  useKeyboard(
    gameState === "playing" ? { moveLeft, moveRight, hardDrop } : null,
  );

  return (
    <div className="game-container">
      <h1 className="title">
        {"COLORBLOXX".split("").map((char, i) => (
          <span key={i} className={`letter letter-${i}`}>
            {char}
          </span>
        ))}
      </h1>
      <div className="board-wrapper">
        <GameCanvas board={board} player={player} />
        {gameState === "idle" && (
          <div className="start-overlay">
            <button className="start-button" onClick={startGame}>
              START GAME
            </button>
          </div>
        )}
      </div>
      <div className="instructions">
        <div className="controls">
          <span className="key">←</span><span className="key">→</span> Move
          <span className="sep">|</span>
          <span className="key">↑</span> Rotate
          <span className="sep">|</span>
          <span className="key">↓</span> Drop
        </div>
        {gameState === "idle" && (
          <p className="hint">Press START to play</p>
        )}
      </div>
    </div>
  );
}

export default App;
