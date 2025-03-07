import type { ViewProps } from "react-native";
export interface IReactNativeJoystickEvent {
  type: "move" | "stop" | "start";
  position: {
    x: number;
    y: number;
  };
  force: number;
  angle: {
    radian: number;
    degree: number;
  };
}

export interface IReactNativeJoystickProps extends ViewProps {
  onStart?: (e: IReactNativeJoystickEvent) => void;
  onMove?: (e: IReactNativeJoystickEvent) => void;
  onStop?: (e: IReactNativeJoystickEvent) => void;
  radius?: number;
  color?: string;
}
