import type React from 'react';
import { useCallback, useState, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { 
  Canvas, 
  Rect,
} from '@shopify/react-native-skia';
import { CoffeeShopLogic } from './game/CoffeeShopLogic';
import { Player } from './game/Player';
import { useFocusEffect } from '@react-navigation/native';


const TILE_SIZE = 32;
const SHOP_WIDTH = 20;
const SHOP_HEIGHT = 15;

const initialCharacters = [
  new Player({x: 5, y: 5, color: '#0000FF', role: 'Barista', id: '1'}),
  new Player({x: 15, y: 5, color: '#FF0000', role: 'Cashier', id: '2'}),
  new Player({x: 10, y: 10, color: '#00FF00', role: 'Waiter', id: '3'})
];

export const CoffeeShop: React.FC = () => {

  const handleKeyDown = (event: React.KeyboardEvent) => {
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
    }
  };

  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [interactionMessage, setInteractionMessage] = useState<string>('');
  const coffeeShopLogic = new CoffeeShopLogic(SHOP_WIDTH, SHOP_HEIGHT);
  const [characters, setCharacters] = useState<Player[]>(initialCharacters);
  const viewRef = useRef<View>(null);

  const handleInteraction = () => {
    const activeCharacter = characters[activeCharacterIndex];
    const message = coffeeShopLogic.getInteractionMessage(
      activeCharacter.x,
      activeCharacter.y,
      activeCharacter.role
    );
    setInteractionMessage(message);
    setTimeout(() => setInteractionMessage(''), 2000);
  };

  const handleMove = (dx: number, dy: number) => {
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
  };

  const behavior= Platform.OS === 'web'? { onKeyDown: handleKeyDown} : {}

  useFocusEffect(
    useCallback(() => {
      viewRef.current?.focus();
      return () => {};
    }, [])
  );

  return (
    <View
      ref={viewRef}
      style={styles.container}
      {...behavior}
      tabIndex={0}
    >
        <Canvas
          style={styles.canvas}
        >
          {/* Draw Tiles */}
          {coffeeShopLogic.layout.map((row, y) =>
            row.map((tile, x) => (
              <Rect
                key={tile.id}
                x={x * TILE_SIZE}
                y={y * TILE_SIZE}
                width={TILE_SIZE}
                height={TILE_SIZE}
                color={tile.color}
              />
            ))
          )}
          {/* Draw Characters */}
          {characters.map((character) => (
            <Rect
              key={character.id}
              x={character.x * TILE_SIZE}
              y={character.y * TILE_SIZE}
              width={TILE_SIZE}
              height={TILE_SIZE}
              color={character.color}
            />
          ))}
        </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8fd',
  },
  canvas: {
    width: TILE_SIZE * SHOP_WIDTH,
    height: TILE_SIZE * SHOP_HEIGHT,
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
});

export default CoffeeShop;