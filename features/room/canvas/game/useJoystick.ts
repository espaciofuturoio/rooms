import type { IReactNativeJoystickEvent } from "@/libs/react-native-joystick";
import { useCallback, useRef } from "react";
import type { PlayerLayout } from "../realtime/StudyRoomState.schema";

// Throttling: This is generally the best option when you want to ensure that a function is called at most once in a specified time period. It's useful for scenarios where you want to maintain a consistent rate of function execution, such as handling joystick movements to mimic walking. Throttling will drop extra calls that occur within the delay period, which can help create a smoother, more controlled movement effect.
// Debouncing: This is more suitable when you want to ensure that a function is only called after a certain period of inactivity. It's often used for scenarios like search input fields, where you want to wait until the user has stopped typing before making a request.

// Joystick event type
// const joystickEvent = {
//     "position": {
//         "x": 91.90625,
//         "y": 55.0390625
//     },
//     "angle": {
//         "radian": 0.11967151064253578,
//         "degree": 6.856672487772215
//     },
//     "force": 0.8441625293606454,
//     "type": "move"
// }

export const useJoystick = (
  handleMove: (
    dx: number,
    dy: number,
    direction: PlayerLayout["direction"],
  ) => void,
) => {
  const lastCallTimeRef = useRef<number>(0);

  const throttledHandleMove = useCallback(
    (dx: number, dy: number, direction: PlayerLayout["direction"]) => {
      const now = Date.now();
      const delay = 200; // Adjust the delay for desired walking speed

      if (now - lastCallTimeRef.current >= delay) {
        console.log("throttledHandleMove", dx, dy);
        handleMove(dx, dy, direction);
        lastCallTimeRef.current = now;
      }
    },
    [handleMove],
  );

  const onMoveJoystick = (input: IReactNativeJoystickEvent) => {
    console.log("onMoveJoystick", input);
    const { angle } = input;
    const angleInDegrees = angle.degree;

    // Determine direction based on angle
    let dx = 0;
    let dy = 0;
    let direction: PlayerLayout["direction"] = "down";
    if (angleInDegrees >= 45 && angleInDegrees < 135) {
      dy = -1; // Up
      direction = "up";
    } else if (angleInDegrees >= 135 && angleInDegrees < 225) {
      dx = -1; // Left
      direction = "left";
    } else if (angleInDegrees >= 225 && angleInDegrees < 315) {
      dy = 1; // Down
      direction = "down";
    } else {
      dx = 1; // Right
      direction = "right";
    }

    // Use the throttled function to handle movement
    throttledHandleMove(dx, dy, direction);
  };

  return { onMoveJoystick };
};
