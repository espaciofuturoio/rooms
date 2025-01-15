import { Canvas, Rect, Image, useAnimatedImageValue, Skia, useImage } from '@shopify/react-native-skia';
import type { PlayerLayout, TileLayout } from './realtime/StudyRoomState.schema';
import { isMobileBrowser } from './utils';
import { isMobile } from './utils';
import { Image as ExpoImage } from 'expo-image';

interface CanvasRendererProps {
  layout: TileLayout[][];
  players: Array<[string, PlayerLayout]>;
  widthUnits: number | undefined;
  heightUnits: number | undefined;
}

export const TILE_SIZE = isMobile || isMobileBrowser ? 16: 32;

// const Character = ({ x, y, color }: { x: number, y: number, color: string }) => {
//   return <Rect x={x * TILE_SIZE} y={y * TILE_SIZE} width={TILE_SIZE} height={TILE_SIZE} color={color} />;
// };

// const p1 = require("./tile000.png")
// console.log(p1)

const data = Skia.Data.fromBase64("iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAOrUqi8nI3Q/OdWLbD8oMuSmcrhvUOQ7RBgUJQCV6RJOif///yDKkqoAAAACdFJOUwAAdpPNOAAAAAFiS0dEDIGzUWMAAAAHdElNRQfpAQ8VIAFg8qyjAAAA30lEQVQoz6WRTQ6CMBCFmx7BE5jhL7DsgAcQuAAIB2jCHIBEcO3CsDaewCVLTmiBFquJKydtk/d13kw6ZexX7L80F2rDpgAcwcE9arlzU0ThZqlYgTNrjNVRrAloItGFnY1owLFUjtICCS4gLo1lvsRcAd3Fm5UNHIzr2YC5MG1zajBRrFqLeHFNVB0U02/hpxqoKfzSM23PtETTmre2JEktaQADaqmTndxmxFeLfI/LX4A1RB70fQ/MAsONBt/KCC7DcLUsvA8fmf8BonG0AYNogskuyqLn17+Fd/ZHvABgxz0OPo4v5wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wMS0xNVQyMTozMTozMCswMDowMKlfEMsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDEtMTVUMjE6MzE6MzArMDA6MDDYAqh3AAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTAxLTE1VDIxOjMyOjAxKzAwOjAwTNg+/AAAAABJRU5ErkJggg==");
const imageBase64 = Skia.Image.MakeImageFromEncoded(data);

const Character = ({ x, y, color }: { x: number, y: number, color: string }) => {
  
  if (!imageBase64) return null;
  return <Image
  image={imageBase64}
  x={x * TILE_SIZE}
  y={y * TILE_SIZE}
  width={TILE_SIZE}
  height={TILE_SIZE}
  fit="contain"
/>;
};

// const Character = ({ x, y, color }: { x: number, y: number, color: string }) => {
//   const image1 = useImage(p1);
//   if (!image1) return null;
//   return <Image
//   image={image1}
//   x={x * TILE_SIZE}
//   y={y * TILE_SIZE}
//   width={TILE_SIZE}
//   height={TILE_SIZE}
//   fit="contain"
// />;
// };

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ layout, players, widthUnits, heightUnits }) => {
  if (!widthUnits || !heightUnits || !layout || !players) return null;
  return (
    <>
    <ExpoImage source={require("./tile000.png")} style={{ width: TILE_SIZE, height: TILE_SIZE }} />
    <Canvas style={{ width: widthUnits * TILE_SIZE, height: heightUnits * TILE_SIZE }}>
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
      {players.map(([id, player]) => (
        <Character
          key={id}
          x={player.x}
          y={player.y}
          color={player.color}
        />
      ))}
    </Canvas>
    </>
  );
}; 