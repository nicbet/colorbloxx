import { useEffect } from "react";

interface Actions {
  moveLeft: () => void;
  moveRight: () => void;
  hardDrop: () => void;
}

export function useKeyboard(actions: Actions | null) {
  useEffect(() => {
    if (!actions) return;

    const { moveLeft, moveRight, hardDrop } = actions;

    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [actions]);
}
