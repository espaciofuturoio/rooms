import { Canvas, Rect } from '@shopify/react-native-skia';
import type { PlayerLayout, TileLayout } from './realtime/StudyRoomState.schema';
import { isMobileBrowser } from './utils';
import { isMobile } from './utils';

interface CanvasRendererProps {
  layout: TileLayout[][];
  players: Array<[string, PlayerLayout]>;
  widthUnits: number | undefined;
  heightUnits: number | undefined;
}

export const TILE_SIZE = isMobile || isMobileBrowser ? 16: 32;

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ layout, players, widthUnits, heightUnits }) => {
  if (!widthUnits || !heightUnits || !layout || !players) return null;
  return (
    <Canvas style={{ width: widthUnits * TILE_SIZE, height: heightUnits * TILE_SIZE }}>
      {/* Draw Tiles */}
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
        ))
      )}
      {/* Draw Players */}
      {players.map(([id, player]) => (
        <Rect
          key={id}
          x={player.x * TILE_SIZE}
          y={player.y * TILE_SIZE}
          width={TILE_SIZE}
          height={TILE_SIZE}
          color={player.color}
        />
      ))}
    </Canvas>
  );
}; 