import { Canvas, Rect } from '@shopify/react-native-skia';
import type { TileLayout } from './realtime/StudyRoomState.schema';
import type { Player } from './game/Player';

interface CanvasRendererProps {
  layout: TileLayout[][];
  players: TileLayout[];
  tileSize: number;
  widthUnits: number | undefined;
  heightUnits: number | undefined;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ layout, players, tileSize, widthUnits, heightUnits }) => {
  if (!widthUnits || !heightUnits) return null;
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
      {/* Draw Characters */}
      {players.map((character) => (
        <Rect
          key={character.id}
          x={character.x * tileSize}
          y={character.y * tileSize}
          width={tileSize}
          height={tileSize}
          color={character.color}
        />
      ))}
    </Canvas>
  );
}; 