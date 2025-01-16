import {
	Canvas,
	Rect,
	Image,
	useAnimatedImageValue,
	useImage,
  type SkImage,
} from "@shopify/react-native-skia";
import type {
	PlayerLayout,
	TileLayout,
} from "./realtime/StudyRoomState.schema";
import { isMobileBrowser } from "./utils";
import { isMobile } from "./utils";
import { Platform } from "react-native";
import { memo } from "react";
import type { SharedValue } from "react-native-reanimated";

interface CanvasRendererProps {
	layout: TileLayout[][];
	players: Array<[string, PlayerLayout]>;
	widthUnits: number | undefined;
	heightUnits: number | undefined;
}

export const TILE_SIZE = isMobile || isMobileBrowser ? 16 : 32;

// Assets
const walkUp = Platform.OS === "web" ? require("@/assets/images/sprites/walk-up.webp").uri : require("@/assets/images/sprites/walk-up.webp");
const walkDown = Platform.OS === "web" ? require("@/assets/images/sprites/walk-down.webp").uri : require("@/assets/images/sprites/walk-down.webp");
const walkLeft = Platform.OS === "web" ? require("@/assets/images/sprites/walk-left.webp").uri : require("@/assets/images/sprites/walk-left.webp");
const walkRight = Platform.OS === "web" ? require("@/assets/images/sprites/walk-right.webp").uri : require("@/assets/images/sprites/walk-right.webp");

const idleUp = Platform.OS === "web" ? require("@/assets/images/sprites/idle-up.png").uri : require("@/assets/images/sprites/idle-up.png");
const idleDown = Platform.OS === "web" ? require("@/assets/images/sprites/idle-down.png").uri : require("@/assets/images/sprites/idle-down.png");
const idleLeft = Platform.OS === "web" ? require("@/assets/images/sprites/idle-left.png").uri : require("@/assets/images/sprites/idle-left.png");
const idleRight = Platform.OS === "web" ? require("@/assets/images/sprites/idle-right.png").uri : require("@/assets/images/sprites/idle-right.png");

const getAnimatedImage = (direction: PlayerLayout["direction"]) => {
  switch (direction) {
    case "up":
      return walkUp;
    case "down":
      return walkDown;
    case "left":
      return walkLeft;
    case "right":
      return walkRight;
  }
};

const getStaticImage = (direction: PlayerLayout["direction"]) => {
  switch (direction) {
    case "up":
      return idleUp;
    case "down":
      return idleDown;
    case "left":
      return idleLeft;
    case "right":
      return idleRight;
  }
};

const AnimatedCharacter = ({ x, y, image }: { x: number; y: number, image: SharedValue<SkImage | null>}) => {
  if (!image) {
    console.log("No image found for AnimatedCharacter");
    return null;
  }
	return (
		<Image
			image={image}
			x={x * TILE_SIZE}
			y={y * TILE_SIZE}
			width={TILE_SIZE}
			height={TILE_SIZE}
			fit="contain"
		/>
	);
};

const StaticCharacter = memo(({ x, y, image }: { x: number; y: number; image: SkImage | null}) => {
  if (!image) {
    console.log("No image found for StaticCharacter");
    return null;
  } 
  console.log("StaticCharacter");
  return (
    <Image
      image={image}
      x={x * TILE_SIZE}
      y={y * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fit="contain"
    />
  );
});

const useStaticImages = () => {
  const up = useImage(idleUp);
  const down = useImage(idleDown);
  const left = useImage(idleLeft);
  const right = useImage(idleRight);
  return { up, down, left, right };
}


const useAnimatedImages = () => {
  const up = useAnimatedImageValue(walkUp);
  const down = useAnimatedImageValue(walkDown);
  const left = useAnimatedImageValue(walkLeft);
  const right = useAnimatedImageValue(walkRight);
  return { up, down, left, right };
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
	layout,
	players,
	widthUnits,
	heightUnits,
}) => {
	if (!widthUnits || !heightUnits || !layout || !players) return null;
  const staticPlayers = players.filter(([_, player]) => player.action === "idle");
  const walkingPlayers = players.filter(([_, player]) => player.action === "walk");
  const staticImages = useStaticImages();
  const animatedImages = useAnimatedImages();
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
					<AnimatedCharacter key={id} x={player.x} y={player.y} image={animatedImages[player.direction]}/>
				))}
				{staticPlayers.map(([id, player]) => (
					<StaticCharacter key={id} x={player.x} y={player.y} image={staticImages[player.direction]}/>
				))}
			</Canvas>
		</>
	);
};
