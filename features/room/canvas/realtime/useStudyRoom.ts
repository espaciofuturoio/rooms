import { useEffect } from "react";
import {
	connectToColyseus,
	disconnectFromColyseus,
	sendMessage,
	useColyseusRoom,
	useColyseusState,
} from "./colyseus";
import type { PlayerLayout, TileLayout } from "./StudyRoomState.schema";

const convertTo2DArray = (
	tiles: TileLayout[] | undefined,
	widthUnits: number | undefined,
	heightUnits: number | undefined,
): TileLayout[][] => {
	if (!tiles || !widthUnits || !heightUnits) return [];
	const layout: TileLayout[][] = [];

	for (let y = 0; y < heightUnits; y++) {
		layout[y] = [];
		for (let x = 0; x < widthUnits; x++) {
			const index = y * widthUnits + x;
			layout[y][x] = tiles[index];
		}
	}

	return layout;
};

const toMap = <T>(tiles: Record<string, T>): Array<[string, T]> => {
	if (!tiles) return [];
	return Object.entries(tiles);
};

export const useStudyRoom = () => {
	useEffect(() => {
		(async () => {
			await connectToColyseus("study-room");
		})();

		return () => {
			disconnectFromColyseus();
		};
	}, []);

	const state = useColyseusState();

	const sessionId = useColyseusRoom()?.sessionId;
	const widthUnits = useColyseusState((state) => state.widthUnits);
	const heightUnits = useColyseusState((state) => state.heightUnits);
	const layout1D = useColyseusState(
		(state) => state.layout,
	)?.toJSON() as TileLayout[];
	const layout2D = convertTo2DArray(layout1D, widthUnits, heightUnits);
	const players = toMap<PlayerLayout>(useColyseusState(
		(state) => state.players,
	)?.toJSON());


	const movePlayer = (dx: number, dy: number) => {
		console.log("movePlayer", dx, dy);
		sendMessage("move", { dx, dy });
	};

	console.log("layout", layout2D);
	console.log("players", players, state);

	return { sessionId, widthUnits, heightUnits, layout: layout2D, players, movePlayer };
};
