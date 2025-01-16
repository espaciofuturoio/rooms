import { ReactNativeJoystick } from "@/libs/react-native-joystick";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CanvasRenderer } from "./CanvasRenderer";
import { useJoystick } from "./game/useJoystick";
import { useKeyHandler } from "./game/useKeyHandler";
import { useStudyRoom } from "./realtime/useStudyRoom";
import { isDesktopBrowser, isMobile, isMobileBrowser } from "./utils";

const enableJoystick = isMobile || isMobileBrowser;
// const enableJoystick = true;

export const CoffeeShop: React.FC = () => {
  const {
    sessionId,
    widthUnits,
    heightUnits,
    layout,
    players,
    movePlayer,
    stopPlayer,
  } = useStudyRoom();
  const { handleKeyPress, handleKeyUp } = useKeyHandler({
    handleMove: movePlayer,
    handleKeyRelease: stopPlayer,
  });
  const { onMoveJoystick } = useJoystick(movePlayer);
  const viewRef = useRef<View>(null);

  const behavior =
    Platform.OS === "web"
      ? { onKeyDown: handleKeyPress, onKeyUp: handleKeyUp }
      : {};

  useFocusEffect(
    useCallback(() => {
      viewRef.current?.focus();
      return () => {};
    }, []),
  );

  const handleXButtonPress = () => {
    console.log("X Button pressed");
  };

  const handleYButtonPress = () => {
    console.log("Y Button pressed");
  };

  if (!sessionId || !layout) return <Text>Loading...</Text>;

  return (
    <View ref={viewRef} style={styles.container} {...behavior} tabIndex={0}>
      <CanvasRenderer
        layout={layout}
        players={players}
        widthUnits={widthUnits}
        heightUnits={heightUnits}
      />
      {isDesktopBrowser && <Text>You can use ↑ ↓ ← → to move around</Text>}
      {enableJoystick && (
        <>
          <View style={{ position: "absolute", bottom: 20, left: 20 }}>
            <ReactNativeJoystick
              color="#06b6d4"
              radius={50}
              onMove={onMoveJoystick}
              onStop={stopPlayer}
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ position: "absolute", bottom: 20, right: 80 }}>
              <TouchableOpacity
                style={[styles.circleButton, styles.xButton]}
                onPress={handleXButtonPress}
              >
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={{ position: "absolute", bottom: 60, right: 20 }}>
              <TouchableOpacity
                style={[styles.circleButton, styles.yButton]}
                onPress={handleYButtonPress}
              >
                <Text style={styles.buttonText}>Y</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fd",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    right: 20,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  xButton: {
    backgroundColor: "#ff6347",
  },
  yButton: {
    backgroundColor: "#4682b4",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  canvas: {
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
});

export default CoffeeShop;
