import { useCallback, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCharacterMovement } from './game/useCharacterMovement';
import { useKeyHandler } from './game/useKeyHandler';
import { CanvasRenderer } from './CanvasRenderer';
import { SHOP_HEIGHT_UNITS, SHOP_WIDTH_UNITS, TILE_SIZE, useGameSetup } from './game/useGameSetup';
import { isDesktopBrowser, isMobileBrowser, isMobile } from './utils';
import { ReactNativeJoystick } from "@/libs/react-native-joystick";
import { useJoystick } from './game/useJoystick';

// const enableJoystick = isMobile || isMobileBrowser;
const enableJoystick = true;
export const CoffeeShop: React.FC = () => {
  const { coffeeShopLogic, initialCharacters, TILE_SIZE } = useGameSetup();
  const { characters, handleMove, changeCharacter, handleStop } = useCharacterMovement(initialCharacters, coffeeShopLogic);
  const handleKeyDown = useKeyHandler(handleMove, changeCharacter);
  const {onMoveJoystick} = useJoystick(handleMove);
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
      {isDesktopBrowser && (
      <>
        <Text>Desktop: You can use Joystick or Arrow Keys to move around</Text>
        <Text>Arrow Key Codes:</Text>
        <Text>↑</Text>
        <Text>↓</Text>
        <Text>←</Text>
        <Text>→</Text>
      </>
    )}
      {isMobileBrowser && <Text>Mobile</Text>}
      {isMobile && <Text>Mobile</Text>}
      {enableJoystick && <ReactNativeJoystick color="#06b6d4" radius={75} onMove={onMoveJoystick} onStop={handleStop} />}
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