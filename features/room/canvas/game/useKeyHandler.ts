import { useCallback } from "react";
import type { PlayerLayout } from "../realtime/StudyRoomState.schema";

export const useKeyHandler = ({
  handleMove,
  interact,
  handleKeyRelease,
}: {
  handleMove: (
    dx: number,
    dy: number,
    direction: PlayerLayout["direction"],
  ) => void;
  interact?: () => void;
  handleKeyRelease?: (key: string) => void;
}) => {
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}`);
      const key = event.key;
      switch (key) {
        case "ArrowUp":
          handleMove(0, -1, "up");
          break;
        case "ArrowDown":
          handleMove(0, 1, "down");
          break;
        case "ArrowLeft":
          handleMove(-1, 0, "left");
          break;
        case "ArrowRight":
          handleMove(1, 0, "right");
          break;
        case "x":
        case "X":
          interact?.();
          break;
      }
    },
    [handleMove, interact],
  );

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent) => {
      const key = event.key;
      console.log(`Key released: ${key}`);
      switch (key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          handleKeyRelease?.(key);
          break;
      }
    },
    [handleKeyRelease],
  );

  return { handleKeyPress, handleKeyUp };
};
