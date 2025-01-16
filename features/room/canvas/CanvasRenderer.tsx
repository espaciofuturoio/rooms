import {
  Canvas,
  ColorMatrix,
  Image,
  Rect,
  type SkImage,
  useAnimatedImageValue,
  useImage,
} from "@shopify/react-native-skia";
import { memo } from "react";
import { Platform } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type {
  PlayerLayout,
  TileLayout,
} from "./realtime/StudyRoomState.schema";
import { isMobileBrowser } from "./utils";
import { isMobile } from "./utils";

interface CanvasRendererProps {
  layout: TileLayout[][];
  players: Array<[string, PlayerLayout]>;
  widthUnits: number | undefined;
  heightUnits: number | undefined;
}

export const TILE_SIZE = isMobile || isMobileBrowser ? 16 : 32;

// Assets
const walkUp =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/walk-up.webp").uri
    : require("@/assets/images/sprites/boy/walk-up.webp");
const walkDown =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/walk-down.webp").uri
    : require("@/assets/images/sprites/boy/walk-down.webp");
const walkLeft =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/walk-left.webp").uri
    : require("@/assets/images/sprites/boy/walk-left.webp");
const walkRight =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/walk-right.webp").uri
    : require("@/assets/images/sprites/boy/walk-right.webp");

const idleUp =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/idle-up.png").uri
    : require("@/assets/images/sprites/boy/idle-up.png");
const idleDown =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/idle-down.png").uri
    : require("@/assets/images/sprites/boy/idle-down.png");
const idleLeft =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/idle-left.png").uri
    : require("@/assets/images/sprites/boy/idle-left.png");
const idleRight =
  Platform.OS === "web"
    ? require("@/assets/images/sprites/boy/idle-right.png").uri
    : require("@/assets/images/sprites/boy/idle-right.png");

// Simple hash function to generate a number from a string
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Predefined set of color matrices
const colorMatrices = [
  [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, -0.1, 0, 0, 0, 0, 0, 0, 1, 1, 1, -0.1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0.75, 0.75, 0.75, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
  [0.75, 0.75, 0, 0, 0, 0.75, 0.75, 0, 0, 0.6, 0, 0, 0, 0, 0.6, 0, 0, 0, 1, 0],
  [0.5, 0.5, 0, 0, 0.4, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0.4, 0, -2, 0, 1, 0],
  // Additional matrices
  [0.9, 0.1, 0, 0, 0, 0.1, 0.9, 0, 0, 0, 0, 0.1, 0.9, 0, 0, 0, 0, 0, 1, 0],
  [
    0.6, 0.3, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.1, 0.3, 0.6, 0, 0, 0, 0, 0, 1,
    0,
  ],
  [0.8, 0.2, 0, 0, 0, 0.2, 0.8, 0, 0, 0, 0, 0.2, 0.8, 0, 0, 0, 0, 0, 1, 0],
  [
    0.7, 0.2, 0.1, 0, 0, 0.2, 0.7, 0.1, 0, 0, 0.1, 0.2, 0.7, 0, 0, 0, 0, 0, 1,
    0,
  ],
  [0.5, 0.5, 0, 0, 0, 0.5, 0.5, 0, 0, 0, 0, 0.5, 0.5, 0, 0, 0, 0, 0, 1, 0],
  [
    0.4, 0.4, 0.2, 0, 0, 0.4, 0.4, 0.2, 0, 0, 0.2, 0.4, 0.4, 0, 0, 0, 0, 0, 1,
    0,
  ],
];

// Function to select a matrix based on the id
const generateMatrixFromId = (id: string): number[] => {
  const hash = simpleHash(id);
  const index = hash % colorMatrices.length;
  return colorMatrices[index];
};

const AnimatedCharacter = ({
  x,
  y,
  image,
  id,
}: {
  x: number;
  y: number;
  image: SharedValue<SkImage | null>;
  id: string;
}) => {
  if (!image) {
    console.log("No image found for AnimatedCharacter");
    return null;
  }
  const matrix = generateMatrixFromId(id);
  return (
    <Image
      image={image}
      x={x * TILE_SIZE}
      y={y * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fit="contain"
    >
      <ColorMatrix matrix={matrix} />
    </Image>
  );
};

const StaticCharacter = ({
  x,
  y,
  image,
  id,
}: { x: number; y: number; image: SkImage | null; id: string }) => {
  if (!image) {
    console.log("No image found for StaticCharacter");
    return null;
  }
  const matrix = generateMatrixFromId(id);
  console.log("StaticCharacter");
  return (
    <Image
      image={image}
      x={x * TILE_SIZE}
      y={y * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fit="contain"
    >
      <ColorMatrix matrix={matrix} />
    </Image>
  );
};

const useStaticImages = () => {
  const up = useImage(idleUp);
  const down = useImage(idleDown);
  const left = useImage(idleLeft);
  const right = useImage(idleRight);
  return { up, down, left, right };
};

const useAnimatedImages = () => {
  const up = useAnimatedImageValue(walkUp);
  const down = useAnimatedImageValue(walkDown);
  const left = useAnimatedImageValue(walkLeft);
  const right = useAnimatedImageValue(walkRight);
  return { up, down, left, right };
};

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  layout,
  players,
  widthUnits,
  heightUnits,
}) => {
  const staticImages = useStaticImages();
  const animatedImages = useAnimatedImages();
  if (!widthUnits || !heightUnits || !layout || !players) return null;
  const staticPlayers = players.filter(
    ([_, player]) => player.action === "idle",
  );
  const walkingPlayers = players.filter(
    ([_, player]) => player.action === "walk",
  );
  return (
    <>
      <Canvas
        style={{
          width: widthUnits * TILE_SIZE,
          height: heightUnits * TILE_SIZE,
        }}
      >
        {layout.map((row, y) =>
          row.map((tile, x) => (
            <Rect
              key={tile.id}
              x={x * TILE_SIZE}
              y={y * TILE_SIZE}
              width={TILE_SIZE}
              height={TILE_SIZE}
              color={tile.color}
            />
          )),
        )}
        {walkingPlayers.map(([id, player]) => (
          <AnimatedCharacter
            key={id}
            x={player.x}
            y={player.y}
            image={animatedImages[player.direction]}
            id={id}
          />
        ))}
        {staticPlayers.map(([id, player]) => (
          <StaticCharacter
            key={id}
            x={player.x}
            y={player.y}
            image={staticImages[player.direction]}
            id={id}
          />
        ))}
      </Canvas>
    </>
  );
};
