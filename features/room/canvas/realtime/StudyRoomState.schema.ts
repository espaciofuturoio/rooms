import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";

export const WIDTH_UNITS = 20;
export const HEIGHT_UNITS = 15;

export type TileType =
  | "wall"
  | "counter"
  | "coffee_machine"
  | "cash_register"
  | "table"
  | "chair"
  | "floor"
  | "player";
export type PlayerDirection = "up" | "down" | "left" | "right";
export type PlayerAction = "idle" | "walk";

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
  const layout: TileLayout[][] = [];
  for (let y = 0; y < heightUnits; y++) {
    layout[y] = [];
    for (let x = 0; x < widthUnits; x++) {
      if (x === 0 || x === widthUnits - 1 || y === 0 || y === heightUnits - 1) {
        layout[y][x] = { id: `wall-${x}-${y}`, color: "#8B4513", type: "wall" }; // Wall
      } else if (
        (x === 3 || x === widthUnits - 4) &&
        y > 2 &&
        y < heightUnits - 3
      ) {
        layout[y][x] = {
          id: `counter-${x}-${y}`,
          color: "#D2691E",
          type: "counter",
        }; // Counter
      } else if (x === 4 && y === 3) {
        layout[y][x] = {
          id: `coffee_machine-${x}-${y}`,
          color: "#4682B4",
          type: "coffee_machine",
        }; // Coffee Machine
      } else if (x === widthUnits - 5 && y === 3) {
        layout[y][x] = {
          id: `cash_register-${x}-${y}`,
          color: "#DAA520",
          type: "cash_register",
        }; // Cash Register
      } else if ((x === 7 || x === 13) && (y === 7 || y === 11)) {
        layout[y][x] = {
          id: `table-${x}-${y}`,
          color: "#A0522D",
          type: "table",
        }; // Table
      } else if (
        (x === 6 || x === 8 || x === 12 || x === 14) &&
        (y === 7 || y === 11)
      ) {
        layout[y][x] = {
          id: `chair-${x}-${y}`,
          color: "#DEB887",
          type: "chair",
        }; // Chair
      } else {
        layout[y][x] = {
          id: `floor-${x}-${y}`,
          color: "#F5DEB3",
          type: "floor",
        }; // Floor
      }
    }
  }
  return layout;
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
