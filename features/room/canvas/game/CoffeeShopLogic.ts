export type TileColor = {
  id: string;
  color: string;
  type: string;
};

export class CoffeeShopLogic {
  public layout: TileColor[][];

  constructor(private width: number, private height: number) {
    this.layout = this.generateLayout();
  }

  private generateLayout(): TileColor[][] {
    const layout: TileColor[][] = [];
    for (let y = 0; y < this.height; y++) {
      layout[y] = [];
      for (let x = 0; x < this.width; x++) {
        if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
          layout[y][x] = { id: `wall-${x}-${y}`, color: '#8B4513', type: 'wall' }; // Wall
        } else if ((x === 3 || x === this.width - 4) && y > 2 && y < this.height - 3) {
          layout[y][x] = { id: `counter-${x}-${y}`, color: '#D2691E', type: 'counter' }; // Counter
        } else if (x === 4 && y === 3) {
          layout[y][x] = { id: `coffee_machine-${x}-${y}`, color: '#4682B4', type: 'coffee_machine' }; // Coffee Machine
        } else if (x === this.width - 5 && y === 3) {
          layout[y][x] = { id: `cash_register-${x}-${y}`, color: '#DAA520', type: 'cash_register' }; // Cash Register
        } else if ((x === 7 || x === 13) && (y === 7 || y === 11)) {
          layout[y][x] = { id: `table-${x}-${y}`, color: '#A0522D', type: 'table' }; // Table
        } else if ((x === 6 || x === 8 || x === 12 || x === 14) && (y === 7 || y === 11)) {
          layout[y][x] = { id: `chair-${x}-${y}`, color: '#DEB887', type: 'chair' }; // Chair
        } else {
          layout[y][x] = { id: `floor-${x}-${y}`, color: '#F5DEB3', type: 'floor' }; // Floor
        }
      }
    }
    return layout;
  }

  public isValidMove(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    const tile = this.layout[y][x];
    return tile.type === 'floor' || tile.type === 'chair'; // Floor or Chair
  }

  public getTileColor(x: number, y: number): TileColor {
    return this.layout[y][x];
  }

  public getInteractionMessage(x: number, y: number, role: string): string {
    const tile = this.getTileColor(x, y);
    switch (tile.type) {
      case 'coffee_machine':
        return role === 'Barista' ? 'You made a delicious coffee!' : 'Only the barista can use the coffee machine.';
      case 'cash_register':
        return role === 'Cashier' ? 'You processed a payment.' : 'Only the cashier can use the cash register.';
      case 'table':
        return role === 'Waiter' ? 'You cleaned the table.' : 'Only the waiter can clean tables.';
      default:
        return 'Nothing to interact with here.';
    }
  }
}