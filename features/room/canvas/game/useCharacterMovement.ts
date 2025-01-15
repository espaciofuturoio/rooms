import { useState, useCallback } from 'react';
import type { Player } from './Player';
import type { CoffeeShopLogic } from './CoffeeShopLogic';

export const useCharacterMovement = (initialCharacters: Player[], coffeeShopLogic: CoffeeShopLogic) => {
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [characters, setCharacters] = useState<Player[]>(initialCharacters);
  
  const handleStop = useCallback(() => {
    console.log('handleStop');
  }, []);

  const handleMove = useCallback((dx: number, dy: number) => {
    setCharacters(prevCharacters => {
      const updatedCharacters = [...prevCharacters];
      const activeCharacter = updatedCharacters[activeCharacterIndex];
      const newX = activeCharacter.x + dx;
      const newY = activeCharacter.y + dy;
      if (coffeeShopLogic.isValidMove(newX, newY)) {
        activeCharacter.x = newX;
        activeCharacter.y = newY;
      }
      return updatedCharacters;
    });
  }, [activeCharacterIndex, coffeeShopLogic]);

  const changeCharacter = useCallback(() => {
    setActiveCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
  }, [characters.length]);

  return { characters, handleMove, changeCharacter, handleStop };
}; 