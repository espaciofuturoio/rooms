import { LoadingAnimation } from "@/components/base/LoadingAnimation";
import { ReactNativeJoystick } from "@/libs/react-native-joystick";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
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
import { isMobile, isMobileBrowser } from "./utils";

const enableJoystick = isMobile || isMobileBrowser;

export const CoffeeShop: React.FC = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  console.log("params", params);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to re-render when sessionId changes
  useEffect(() => {
    viewRef.current?.focus();
  }, [sessionId]);

  useEffect(() => {
    router.setParams({ sessionId });
  }, [sessionId]);

  const handleXButtonPress = () => {
    console.log("X Button pressed");
  };

  const handleYButtonPress = () => {
    console.log("Y Button pressed");
  };

  console.log(sessionId);

  if (!sessionId || !layout) return <LoadingAnimation />;

  return (
    <View ref={viewRef} style={styles.container} {...behavior} tabIndex={0}>
      <CanvasRenderer
        layout={layout}
        players={players}
        widthUnits={widthUnits}
        heightUnits={heightUnits}
      />
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
    userSelect: "none",
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
