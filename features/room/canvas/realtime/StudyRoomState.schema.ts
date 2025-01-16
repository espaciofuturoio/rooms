import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";

export const WIDTH_UNITS = 20;
export const HEIGHT_UNITS = 15;

export type TileType =
  | "wall"
  | "counter"
  | "coffee_machine"
  | "cash_register"
  | "table"
  | "floor"
  | "player"
  | "pottedPlantBeige"
  | "pottedPlantRed"
  | "chairRightGreen"
  | "chairRightRed"
  | "chairLeftGreen"
  | "chairLeftRed"
  | "tableWCloth"
  | "tvStand"
  | "tvStandWSwitch"
  | "sofa"
  | "rug";

export type PlayerDirection = "up" | "down" | "left" | "right";
export type PlayerAction = "idle" | "walk";
export const FloorColor = "#F5DEB3";

export type TileLayout = {
  id: string;
  color: string;
  type: TileType;
};

export type PlayerLayout = {
  id: string;
  color: string;
  x: number;
  y: number;
  direction: PlayerDirection;
  action: PlayerAction;
};

export const getTileFromLayout = (
  layout: ArraySchema<Tile>,
  x: number,
  y: number,
  width: number,
): TileLayout | undefined => {
  const index = y * width + x;
  return layout[index];
};

const generateLayout = (
  widthUnits: number,
  heightUnits: number,
): TileLayout[][] => {
  const randInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const createTile = (type: TileType, x: number, y: number, color: string) => ({
    id: `${type}-${x}-${y}`,
    type,
    color,
  });

  // Fill everything with “floor”
  const initialLayout = Array.from({ length: heightUnits }, (_, y) =>
    Array.from({ length: widthUnits }, (_, x) =>
      createTile("floor", x, y, FloorColor),
    ),
  );

  // Helper to check if a tile is free (i.e., is "floor")
  const isTileFree = (layout: TileLayout[][], x: number, y: number): boolean =>
    !!layout[y]?.[x] && layout[y][x].type === "floor";

  // 1. Walls around the border
  const addWalls = (layout: TileLayout[][]): TileLayout[][] =>
    layout.map((row, y) =>
      row.map((tile, x) => {
        const isBorder =
          x === 0 || x === widthUnits - 1 || y === 0 || y === heightUnits - 1;
        return isBorder ? createTile("wall", x, y, "#8B4513") : tile;
      }),
    );

  // 2. Place TV stands inside the top corners first
  //    so we don't accidentally override them with the counter.
  const placeTVs = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);

    // Top-left corner (row=1, col=1)
    if (isTileFree(result, 1, 1)) {
      result[1][1] = createTile("tvStand", 1, 1, "#2F4F4F");
    }

    // Top-right corner (row=1, col = widthUnits-2)
    if (isTileFree(result, widthUnits - 2, 1)) {
      result[1][widthUnits - 2] = createTile(
        "tvStandWSwitch",
        widthUnits - 2,
        1,
        "#696969",
      );
    }

    return result;
  };

  // 3. Decorate a more “café-like” counter a bit further down
  //    Doing it from row=3 so it doesn't block the TVs in the top corners.
  const decorateCounter = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);

    // Horizontal segment (row=3)
    if (heightUnits > 5) {
      for (let x = 2; x < widthUnits - 2; x++) {
        if (isTileFree(result, x, 3)) {
          result[3][x] = createTile("counter", x, 3, "#D2B48C");
        }
      }

      // Vertical segment to form an L shape (down from row=3 to row=5, near x=2)
      for (let y = 3; y <= Math.min(heightUnits - 2, 5); y++) {
        if (isTileFree(result, 2, y)) {
          result[y][2] = createTile("counter", 2, y, "#D2B48C");
        }
      }

      // Place coffee machine near the left side of the counter
      if (isTileFree(result, 3, 3)) {
        result[3][3] = createTile("coffee_machine", 3, 3, "#4682B4");
      }

      // Place cash register near the right side
      if (isTileFree(result, widthUnits - 4, 3)) {
        result[3][widthUnits - 4] = createTile(
          "cash_register",
          widthUnits - 4,
          3,
          "#DAA520",
        );
      }
    }

    return result;
  };

  // 4. Place potted plants near bottom corners
  const placePottedPlants = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);
    const bottomY = heightUnits - 3;

    if (isTileFree(result, 2, bottomY)) {
      result[bottomY][2] = createTile(
        "pottedPlantBeige",
        2,
        bottomY,
        "#8B4513",
      );
    }
    if (isTileFree(result, widthUnits - 3, bottomY)) {
      result[bottomY][widthUnits - 3] = createTile(
        "pottedPlantRed",
        widthUnits - 3,
        bottomY,
        "#FF6347",
      );
    }

    return result;
  };

  // 5. Always place at least two tables (2–4),
  //    each with a matching pair of chairs on left & right sides.
  const placeTablesAndChairs = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);

    const tableCount = randInt(2, 4);
    const tableTypes: TileType[] = ["tableWCloth", "table"];
    let placedTables = 0;

    while (placedTables < tableCount) {
      const x = randInt(2, widthUnits - 3);
      const y = randInt(2, heightUnits - 3);

      if (isTileFree(result, x, y)) {
        const chosenTable = tableTypes[randInt(0, tableTypes.length - 1)];
        result[y][x] = createTile(chosenTable, x, y, "#A0522D");

        const chairLeftTypes: TileType[] = ["chairLeftGreen", "chairLeftRed"];
        const chairRightTypes: TileType[] = [
          "chairRightGreen",
          "chairRightRed",
        ];

        if (isTileFree(result, x + 1, y)) {
          const leftChair =
            chairLeftTypes[randInt(0, chairLeftTypes.length - 1)];
          result[y][x + 1] = createTile(leftChair, x + 1, y, "#228B22");
        }

        if (isTileFree(result, x - 1, y)) {
          const rightChair =
            chairRightTypes[randInt(0, chairRightTypes.length - 1)];
          result[y][x - 1] = createTile(rightChair, x - 1, y, "#8B0000");
        }

        placedTables++;
      }
    }

    return result;
  };

  // 6. Add some sofas and rugs for a more home-like feel
  const placeSofasAndRugs = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);

    // Place 1–2 sofas
    const sofaCount = randInt(1, 2);
    for (let i = 0; i < sofaCount; i++) {
      const x = randInt(2, widthUnits - 3);
      const y = randInt(2, heightUnits - 3);
      if (isTileFree(result, x, y)) {
        result[y][x] = createTile("sofa", x, y, "#B5651D");
      }
    }

    // Place a rug
    const rugX = randInt(2, widthUnits - 3);
    const rugY = randInt(2, heightUnits - 3);
    if (isTileFree(result, rugX, rugY)) {
      result[rugY][rugX] = createTile("rug", rugX, rugY, "#FFD700");
    }

    return result;
  };

  // Reorder our transformations so the TV stands are placed
  // before the counter, preventing the counter from blocking them
  const transformations = [
    addWalls,
    placeTVs, // (2) place TVs early
    decorateCounter, // (3) place counters further down
    placePottedPlants,
    placeTablesAndChairs,
    placeSofasAndRugs,
  ];

  return transformations.reduce(
    (acc, transform) => transform(acc),
    initialLayout,
  );
};

class Tile extends Schema {
  @type("string") id: string;
  @type("string") color: string;
  @type("string") type: TileType;
  constructor(id: string, color: string, type: TileType) {
    super();
    this.id = id;
    this.color = color;
    this.type = type;
  }
}

export class Player extends Tile {
  @type("number") x = 0;
  @type("number") y = 0;
  @type("string") direction: PlayerDirection;
  @type("string") action: PlayerAction;
  constructor({
    id,
    color,
    x,
    y,
    direction,
    action,
  }: {
    id: string;
    color: string;
    x: number;
    y: number;
    direction?: PlayerDirection;
    action?: PlayerAction;
  }) {
    super(id, color, "player");
    this.x = x;
    this.y = y;
    this.direction = direction || "down";
    this.action = action || "idle";
  }
}

export class StudyRoomState extends Schema {
  @type("number") widthUnits = WIDTH_UNITS;
  @type("number") heightUnits = HEIGHT_UNITS;
  @type([Tile]) layout = new ArraySchema<Tile>();
  @type({ map: Player }) players = new MapSchema<Player>();

  rawLayout: TileLayout[][] = [];

  constructor() {
    super();
    this.rawLayout = generateLayout(this.widthUnits, this.heightUnits);

    // Flatten the 2D array into a 1D array
    for (const row of this.rawLayout) {
      for (const tileLayout of row) {
        this.layout.push(
          new Tile(tileLayout.id, tileLayout.color, tileLayout.type),
        );
      }
    }

    console.log("StudyRoomState created");
  }
}
