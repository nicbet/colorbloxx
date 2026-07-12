import { useEffect } from "react";

interface Actions {
  moveLeft: () => void;
  moveRight: () => void;
  hardDrop: () => void;
  rotate: () => void;
  startSoftDrop: () => void;
  stopSoftDrop: () => void;
}

export function useKeyboard(actions: Actions | null) {
  useEffect(() => {
    if (!actions) return;

    const { moveLeft, moveRight, hardDrop, rotate, startSoftDrop, stopSoftDrop } = actions;

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!e.repeat) startSoftDrop();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        stopSoftDrop();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [actions]);
}
