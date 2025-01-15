import { useCallback, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCharacterMovement } from './game/useCharacterMovement';
import { useKeyHandler } from './game/useKeyHandler';
import { CanvasRenderer } from './CanvasRenderer';
import { SHOP_HEIGHT_UNITS, SHOP_WIDTH_UNITS, TILE_SIZE, useGameSetup } from './game/useGameSetup';
import { isDesktopBrowser, isMobileBrowser, isMobile } from './utils';

export const CoffeeShop: React.FC = () => {
  const { coffeeShopLogic, initialCharacters, TILE_SIZE } = useGameSetup();
  const { characters, handleMove, changeCharacter } = useCharacterMovement(initialCharacters, coffeeShopLogic);
  const handleKeyDown = useKeyHandler(handleMove, changeCharacter);
  const viewRef = useRef<View>(null);

  const behavior = Platform.OS === 'web' ? { onKeyDown: handleKeyDown } : {};

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
      <CanvasRenderer coffeeShopLogic={coffeeShopLogic} characters={characters} tileSize={TILE_SIZE} />
      {isDesktopBrowser && <Text>Desktop</Text>}
      {isMobileBrowser && <Text>Mobile</Text>}
      {isMobile && <Text>Mobile</Text>}
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
    width: TILE_SIZE * SHOP_WIDTH_UNITS,
    height: TILE_SIZE * SHOP_HEIGHT_UNITS,
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
});

export default CoffeeShop;