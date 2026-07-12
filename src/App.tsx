import GameCanvas from "./components/GameCanvas";
import GameOver from "./components/GameOver";
import Leaderboard from "./components/Leaderboard";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboard } from "./hooks/useKeyboard";
import { getHighScores } from "./game/highscores";
import { useState } from "react";
import "./App.css";

function App() {
  const {
    board, player, gameState, score, level,
    moveLeft, moveRight, hardDrop, rotate,
    startSoftDrop, stopSoftDrop,
    startGame, playAgain,
  } = useGameLoop();

  const [idleScores, setIdleScores] = useState(getHighScores);

  useKeyboard(
    gameState === "playing"
      ? { moveLeft, moveRight, hardDrop, rotate, startSoftDrop, stopSoftDrop }
      : null,
  );

  const handlePlayAgain = () => {
    setIdleScores(getHighScores());
    playAgain();
  };

  return (
    <div className="game-container">
      <h1 className="title">
        {"COLORBLOXX".split("").map((char, i) => (
          <span key={i} className={`letter letter-${i}`}>
            {char}
          </span>
        ))}
      </h1>
      <div className="game-layout">
        <div className="board-wrapper">
          <GameCanvas board={board} player={player} />
          {gameState === "idle" && (
            <div className="start-overlay">
              <div className="start-content">
                <button className="start-button" onClick={startGame}>
                  START GAME
                </button>
                <Leaderboard scores={idleScores} />
              </div>
            </div>
          )}
          {gameState === "gameover" && (
            <GameOver score={score} onPlayAgain={handlePlayAgain} />
          )}
        </div>
        <div className="side-panel">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
        </div>
      </div>
      <div className="instructions">
        <div className="controls">
          <span className="key">←</span><span className="key">→</span> Move
          <span className="sep">|</span>
          <span className="key">↑</span> Rotate
          <span className="sep">|</span>
          <span className="key">↓</span> Soft Drop
          <span className="sep">|</span>
          <span className="key">Space</span> Hard Drop
        </div>
        {gameState === "idle" && (
          <p className="hint">Press START to play</p>
        )}
      </div>
    </div>
  );
}

export default App;
