import { useEffect, useState } from "react";
import { studyRoom } from "./colyseus";
import type { Room } from "colyseus.js";
import type { StudyRoomState } from "./StudyRoomState.schema";

export const useStudyRoom = () => {
  const room = studyRoom.useColyseusRoom()
	useEffect(() => {
		(async () => {
			await studyRoom.connectToColyseus("study-room");
		})();

		return () => {
			studyRoom.disconnectFromColyseus();
		};
	}, []);

  return { room };
};
