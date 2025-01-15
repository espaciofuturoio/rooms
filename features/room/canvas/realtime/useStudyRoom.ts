import { useEffect } from "react";
import { connectToColyseus, disconnectFromColyseus, useColyseusRoom, useColyseusState } from "./colyseus";
import type { PlayerLayout, TileLayout } from "./StudyRoomState.schema";

const convertTo2DArray = (tiles: TileLayout[] | undefined, widthUnits: number | undefined, heightUnits: number | undefined): TileLayout[][] => {
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
  }

//   const mapTo1DArray = <T>(tiles: Map< | undefined): T[] => {
//     if (!tiles) return [];
//     return Object.values(tiles);
//   }

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
	const widthUnits = useColyseusState(state => state.widthUnits);
	const heightUnits = useColyseusState(state => state.heightUnits);
	const layout1D = (useColyseusState(state => state.layout))?.toJSON() as TileLayout[];
	const layout2D = convertTo2DArray(layout1D, widthUnits, heightUnits);
	const players = useColyseusState(state => state.players)?.toJSON() as PlayerLayout[];
	console.log("layout", layout2D);
	return { sessionId, widthUnits, heightUnits, layout: layout2D, players };
};