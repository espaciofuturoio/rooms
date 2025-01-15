import { useEffect } from "react";
import { connectToColyseus, disconnectFromColyseus, useColyseusRoom, useColyseusState } from "./colyseus";
export const useStudyRoom = () => {
	useEffect(() => {
		(async () => {
			await connectToColyseus("study-room");
		})();

		return () => {
			disconnectFromColyseus();
		};
	}, []);

	const sessionId = useColyseusRoom()?.sessionId;
	const state = useColyseusState(state => state.mySynchronizedProperty);
	return { sessionId, state };
};