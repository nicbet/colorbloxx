import { useEffect } from "react";

interface Actions {
  moveLeft: () => void;
  moveRight: () => void;
  hardDrop: () => void;
}

export function useKeyboard(actions: Actions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          actions.moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          actions.moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          actions.hardDrop();
          break;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [actions]);
}
