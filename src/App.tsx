import GameCanvas from "./components/GameCanvas";
import GameOver from "./components/GameOver";
import Leaderboard from "./components/Leaderboard";
import NextPiece from "./components/NextPiece";
import { useGameLoop } from "./hooks/useGameLoop";
import { useAttractMode } from "./hooks/useAttractMode";
import { useKeyboard } from "./hooks/useKeyboard";
import { getHighScores } from "./game/highscores";
import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const {
    board, player, gameState, score, level, lines, nextTetromino, effectsRef,
    moveLeft, moveRight, hardDrop, rotate,
    startSoftDrop, stopSoftDrop,
    startGame, returnToIdle,
  } = useGameLoop();

  const attract = useAttractMode(gameState === "idle");
  const [displayScores, setDisplayScores] = useState(getHighScores);

  useKeyboard(
    gameState === "playing"
      ? { moveLeft, moveRight, hardDrop, rotate, startSoftDrop, stopSoftDrop }
      : null,
  );

  const startGameRef = useRef(startGame);
  startGameRef.current = startGame;
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameStateRef.current === "idle") {
        e.preventDefault();
        startGameRef.current();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSubmitScore = () => {
    setDisplayScores(getHighScores());
    returnToIdle();
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
          <GameCanvas
            board={gameState === "idle" ? attract.board : board}
            player={gameState === "idle" ? attract.player : player}
            effectsRef={gameState === "playing" ? effectsRef : undefined}
          />
          {gameState === "idle" && (
            <div className="start-overlay">
              <Leaderboard scores={displayScores} />
              <p className="press-enter">Press Enter to Play</p>
            </div>
          )}
          {gameState === "gameover" && (
            <GameOver score={score} onSubmit={handleSubmitScore} />
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
          <span className="key">↓</span> Drop
          <span className="sep">|</span>
          <span className="key">Space</span> Place
        </div>
      </div>
    </div>
  );
}

export default App;
