import React, { useState, useCallback, useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  type GestureTouchEvent,
} from "react-native-gesture-handler";
import type { IReactNativeJoystickProps } from "./types";
import * as utils from "./utils";

export const ReactNativeJoystick = ({
  onStart,
  onMove,
  onStop,
  color = "#000000",
  radius = 150,
  style,
  ...props
}: IReactNativeJoystickProps) => {
  const wrapperRadius = radius;
  const nippleRadius = wrapperRadius / 3;

  const [x, setX] = useState(wrapperRadius - nippleRadius);
  const [y, setY] = useState(wrapperRadius - nippleRadius);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ok
  const handleTouchMove = useCallback(
    (event: GestureTouchEvent) => {
      const e = event.changedTouches[0];
      const fingerX = e.x;
      const fingerY = Platform.OS === "web" ? wrapperRadius * 2 - e.y : e.y;
      let coordinates = {
        x: fingerX - nippleRadius,
        y: fingerY - nippleRadius,
      };

      const angle = utils.calcAngle(
        { x: fingerX, y: fingerY },
        { x: wrapperRadius, y: wrapperRadius },
      );

      let dist = utils.calcDistance(
        { x: wrapperRadius, y: wrapperRadius },
        { x: fingerX, y: fingerY },
      );

      const force = dist / (nippleRadius * 2);

      dist = Math.min(dist, wrapperRadius);
      if (dist === wrapperRadius) {
        coordinates = utils.findCoord(
          { x: wrapperRadius, y: wrapperRadius },
          dist,
          angle,
        );
        coordinates = {
          x: coordinates.x - nippleRadius,
          y: coordinates.y - nippleRadius,
        };
      }
      setX(coordinates.x);
      setY(coordinates.y);

      onMove?.({
        position: coordinates,
        angle: {
          radian: utils.degreesToRadians(angle),
          degree: angle,
        },
        force,
        type: "move",
      });
    },
    [nippleRadius, wrapperRadius],
  );

  const handleTouchEnd = () => {
    setX(wrapperRadius - nippleRadius);
    setY(wrapperRadius - nippleRadius);
    onStop?.({
      force: 0,
      position: {
        x: 0,
        y: 0,
      },
      angle: {
        radian: 0,
        degree: 0,
      },
      type: "stop",
    });
  };

  const handleTouchStart = () => {
    onStart?.({
      force: 0,
      position: {
        x: 0,
        y: 0,
      },
      angle: {
        radian: 0,
        degree: 0,
      },
      type: "start",
    });
  };

  const panGesture = Gesture.Pan()
    .onStart(handleTouchStart)
    .runOnJS(true)
    .onEnd(handleTouchEnd)
    .runOnJS(true)
    .onTouchesMove(handleTouchMove)
    .runOnJS(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ok
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          width: 2 * radius,
          height: 2 * radius,
          borderRadius: radius,
          backgroundColor: `${color}55`,
          transform: [{ rotateX: "180deg" }],
          ...(style && typeof style === "object" ? style : {}),
        },
        nipple: {
          height: 2 * nippleRadius,
          width: 2 * nippleRadius,
          borderRadius: nippleRadius,
          backgroundColor: `${color}bb`,
          position: "absolute",
          transform: [
            {
              translateX: x,
            },
            { translateY: y },
          ],
        },
      }),
    [radius, color, nippleRadius, x, y],
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.wrapper} {...props}>
        <View pointerEvents="none" style={styles.nipple} />
      </View>
    </GestureDetector>
  );
};

export type {
  IReactNativeJoystickEvent,
  IReactNativeJoystickProps,
} from "./types";
