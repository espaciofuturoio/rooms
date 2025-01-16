import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import React from "react";
import { Text } from "react-native";

export const SkiaCanvasRoomLoader = () => (
  <WithSkiaWeb
    getComponent={() => import("./canvas")}
    fallback={<Text>Loading Skia...</Text>}
  />
);
