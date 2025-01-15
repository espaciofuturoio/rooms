import { Canvas, Rect } from '@shopify/react-native-skia';
import type { PlayerLayout, TileLayout } from './realtime/StudyRoomState.schema';

interface CanvasRendererProps {
  layout: TileLayout[][];
  players: Array<[string, PlayerLayout]>;
  tileSize: number;
  widthUnits: number | undefined;
  heightUnits: number | undefined;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ layout, players, tileSize, widthUnits, heightUnits }) => {
  if (!widthUnits || !heightUnits || !layout || !players) return null;
  return (
    <Canvas style={{ width: widthUnits * tileSize, height: heightUnits * tileSize }}>
      {/* Draw Tiles */}
      {layout.map((row, y) =>
        row.map((tile, x) => (
          <Rect
            key={tile.id}
            x={x * tileSize}
            y={y * tileSize}
            width={tileSize}
            height={tileSize}
            color={tile.color}
          />
        ))
      )}
      {/* Draw Players */}
      {players.map(([id, player]) => (
        <Rect
          key={id}
          x={player.x * tileSize}
          y={player.y * tileSize}
          width={tileSize}
          height={tileSize}
          color={player.color}
        />
      ))}
    </Canvas>
  );
}; 