import { Canvas, Rect } from '@shopify/react-native-skia';
import type { CoffeeShopLogic } from './game/CoffeeShopLogic';
import type { Player } from './game/Player';
import { SHOP_HEIGHT, SHOP_WIDTH } from './game/useGameSetup';

interface CanvasRendererProps {
  coffeeShopLogic: CoffeeShopLogic;
  characters: Player[];
  tileSize: number;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ coffeeShopLogic, characters, tileSize }) => {
  return (
    <Canvas style={{ width: SHOP_WIDTH, height: SHOP_HEIGHT }}>
      {/* Draw Tiles */}
      {coffeeShopLogic.layout.map((row, y) =>
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
      {characters.map((character) => (
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