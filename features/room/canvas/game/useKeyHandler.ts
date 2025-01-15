import { useCallback } from 'react';

export const useKeyHandler = (handleMove: (dx: number, dy: number) => void, interact?: () => void) => {
  return useCallback((event: React.KeyboardEvent) => {
    console.log(`Key pressed: ${event.key}`);
    const key = event.key;
    switch (key) {
      case 'ArrowUp':
        handleMove(0, -1);
        break;
      case 'ArrowDown':
        handleMove(0, 1);
        break;
      case 'ArrowLeft':
        handleMove(-1, 0);
        break;
      case 'ArrowRight':
        handleMove(1, 0);
        break;
      case 'x':
      case 'X':
        interact?.();
        break;
    }
  }, [handleMove, interact]);
}; 