import { useCallback, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCharacterMovement } from './game/useCharacterMovement';
import { useKeyHandler } from './game/useKeyHandler';
import { CanvasRenderer } from './CanvasRenderer';
import { useGameSetup } from './game/useGameSetup';
import { isDesktopBrowser, isMobileBrowser, isMobile } from './utils';
import { ReactNativeJoystick } from "@/libs/react-native-joystick";
import { useJoystick } from './game/useJoystick';
import { useStudyRoom } from './realtime/useStudyRoom';

// const enableJoystick = isMobile || isMobileBrowser;
const enableJoystick = true;
export const CoffeeShop: React.FC = () => {
  const { coffeeShopLogic, initialCharacters, TILE_SIZE } = useGameSetup();
  const { characters, handleMove, changeCharacter, handleStop } = useCharacterMovement(initialCharacters, coffeeShopLogic);
  const handleKeyDown = useKeyHandler(handleMove, changeCharacter);
  const {onMoveJoystick} = useJoystick(handleMove);
  const viewRef = useRef<View>(null);

  const {sessionId, widthUnits, heightUnits, layout, players} = useStudyRoom();

  const behavior = Platform.OS === 'web' ? { onKeyDown: handleKeyDown } : {};

  useFocusEffect(
    useCallback(() => {
      viewRef.current?.focus();
      return () => {};
    }, [])
  );

  if (!sessionId || !layout) return <Text>Loading...</Text>;

  console.log({players});

  return (
    <View
      ref={viewRef}
      style={styles.container}
      {...behavior}
      tabIndex={0}
    >
      <CanvasRenderer layout={layout} players={[]} tileSize={TILE_SIZE} widthUnits={widthUnits} heightUnits={heightUnits} />
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
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
});

export default CoffeeShop;