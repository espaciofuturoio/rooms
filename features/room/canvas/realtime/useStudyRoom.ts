import { useColyseus } from "@/libs/use-colyseus";
import { useEffect } from "react";
import type {
  PlayerLayout,
  StudyRoomState,
  TileLayout,
} from "./StudyRoomState.schema";

// const serverWS = "ws://localhost:2567";
const serverWS = "wss://dev-rooms-game-server-631092729836.us-central1.run.app";

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
  const {
    connectToColyseus,
    disconnectFromColyseus,
    useColyseusRoom,
    useColyseusState,
    sendMessage,
  } = useColyseus<StudyRoomState>(serverWS);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run once
  useEffect(() => {
    (async () => {
      await connectToColyseus("study-room");
      console.log("connected to colyseus!");
    })();

    return () => {
      console.log("disconnecting from colyseus!");
      disconnectFromColyseus();
    };
  }, []);

  // TODO: improve reactivity to avoid re-render
  // Players are not reactive???
  const state = useColyseusState();

  const sessionId = useColyseusRoom()?.sessionId;
  const widthUnits = useColyseusState((state) => state.widthUnits);
  const heightUnits = useColyseusState((state) => state.heightUnits);
  const layout1D = useColyseusState(
    (state) => state.layout,
  )?.toJSON() as TileLayout[];
  const layout2D = convertTo2DArray(layout1D, widthUnits, heightUnits);
  const players = toMap<PlayerLayout>(
    useColyseusState((state) => state.players)?.toJSON(),
  );

  const movePlayer = (dx: number, dy: number, direction: string) => {
    console.log("movePlayer", dx, dy, direction);
    sendMessage("move", { dx, dy, direction });
  };

  const stopPlayer = () => {
    console.log("stopPlayer");
    sendMessage("stop", {});
  };

  console.log(
    "players ---->",
    players.map(([id, player]) => ({
      playerId: id,
      action: player.action,
      direction: player.direction,
    })),
  );

  return {
    sessionId,
    widthUnits,
    heightUnits,
    layout: layout2D,
    players,
    movePlayer,
    stopPlayer,
    state,
  };
};
