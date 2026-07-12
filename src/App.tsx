import GameCanvas from "./components/GameCanvas";
import GameOver from "./components/GameOver";
import Leaderboard from "./components/Leaderboard";
import NextPiece from "./components/NextPiece";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboard } from "./hooks/useKeyboard";
import { getHighScores } from "./game/highscores";
import { useState } from "react";
import "./App.css";

function App() {
  const {
    board, player, gameState, score, level, lines, nextTetromino,
    moveLeft, moveRight, hardDrop, rotate,
    startSoftDrop, stopSoftDrop,
    startGame, playAgain,
  } = useGameLoop();

  const [displayScores, setDisplayScores] = useState(getHighScores);

  useKeyboard(
    gameState === "playing"
      ? { moveLeft, moveRight, hardDrop, rotate, startSoftDrop, stopSoftDrop }
      : null,
  );

  const handlePlayAgain = () => {
    setDisplayScores(getHighScores());
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
        <div className="aside aside-left">
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lines</span>
            <span className="stat-value">{lines}</span>
          </div>
        </div>
        <div className="board-wrapper">
          <GameCanvas board={board} player={player} />
          {gameState === "idle" && (
            <div className="start-overlay">
              <div className="start-content">
                <Leaderboard scores={displayScores} />
                <button className="start-button" onClick={startGame}>
                  START
                </button>
              </div>
            </div>
          )}
          {gameState === "gameover" && (
            <GameOver score={score} onPlayAgain={handlePlayAgain} />
          )}
        </div>
        <div className="aside aside-right">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Next</span>
            <NextPiece tetromino={nextTetromino} />
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
        <p className="hint" style={{ visibility: gameState === "idle" ? "visible" : "hidden" }}>
          Press START to play
        </p>
      </div>
    </div>
  );
}

export default App;
