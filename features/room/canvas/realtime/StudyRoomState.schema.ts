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
  | "tvStandWSwitch";
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
  // Helper to generate random integer within [min, max]
  const randInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Create a tile
  const createTile = (type: TileType, x: number, y: number, color: string) => ({
    id: `${type}-${x}-${y}`,
    type,
    color,
  });

  // Start by filling everything with “floor”
  const initialLayout = Array.from({ length: heightUnits }, (_, y) =>
    Array.from({ length: widthUnits }, (_, x) =>
      createTile("floor", x, y, FloorColor),
    ),
  );

  // Add walls around the border
  const addWalls = (layout: TileLayout[][]): TileLayout[][] =>
    layout.map((row, y) =>
      row.map((tile, x) => {
        const isBorder =
          x === 0 || x === widthUnits - 1 || y === 0 || y === heightUnits - 1;
        return isBorder ? createTile("wall", x, y, "#8B4513") : tile;
      }),
    );

  // Decorate the top row with a counter, coffee machine, and cash register
  const decorateTop = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);

    // Place a counter along row 2
    for (let x = 2; x < widthUnits - 2; x++) {
      result[2][x] = createTile("counter", x, 2, "#D2691E");
    }

    // Coffee machine near left side
    if (widthUnits > 4 && heightUnits > 4) {
      result[3][3] = createTile("coffee_machine", 3, 3, "#4682B4");
      result[3][widthUnits - 4] = createTile(
        "cash_register",
        widthUnits - 4,
        3,
        "#DAA520",
      );
    }

    return result;
  };

  // Helper to check if a tile is still “floor” (i.e., free)
  const isTileFree = (layout: TileLayout[][], x: number, y: number): boolean =>
    !!layout[y]?.[x] && layout[y][x].type === "floor";

  // Place potted plants near the bottom corners (inside the walls)
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

  // Place TV stands inside the top corners
  const placeTVs = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);

    if (isTileFree(result, 1, 1)) {
      result[1][1] = createTile("tvStand", 1, 1, "#2F4F4F");
    }
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

  // Place tables randomly, each with at least one left-chair on the right side,
  // and one right-chair on the left side
  const placeTablesAndChairs = (layout: TileLayout[][]): TileLayout[][] => {
    const result = layout.map((row) => [...row]);
    const tableCount = randInt(1, 3);
    const tableTypes: TileType[] = ["tableWCloth", "table"];

    let placedTables = 0;

    while (placedTables < tableCount) {
      const x = randInt(2, widthUnits - 3);
      const y = randInt(2, heightUnits - 3);

      if (isTileFree(result, x, y)) {
        // Randomly choose one of the two table types
        const chosenTable = tableTypes[randInt(0, tableTypes.length - 1)];
        result[y][x] = createTile(chosenTable, x, y, "#A0522D");

        // Chairs that face left on the right side
        const chairLeftTypes: TileType[] = ["chairLeftGreen", "chairLeftRed"];
        // Chairs that face right on the left side
        const chairRightTypes: TileType[] = [
          "chairRightGreen",
          "chairRightRed",
        ];

        // Place a left-facing chair on the right side (x+1, y)
        if (isTileFree(result, x + 1, y)) {
          const leftChair =
            chairLeftTypes[randInt(0, chairLeftTypes.length - 1)];
          result[y][x + 1] = createTile(leftChair, x + 1, y, "#228B22");
        }
        // Place a right-facing chair on the left side (x-1, y)
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

  // Compose the final layout
  // Apply each transformation in sequence to the layout
  const transformations = [
    addWalls,
    decorateTop,
    placePottedPlants,
    placeTVs,
    placeTablesAndChairs,
  ];

  const finalLayout = transformations.reduce(
    (acc, transform) => transform(acc),
    initialLayout,
  );

  return finalLayout;
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
