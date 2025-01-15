export class Player {
  public id: string;
  public x: number;
  public y: number;
  public color: string;
  public role: string;
  constructor({
    x,
    y,
    color,
    role,
    id,
  }: {
    x: number;
    y: number;
    color: string;
    role: string;
    idw: string;
  }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.role = role;
  }
  public draw(ctx: any, tileSize: number): void {
    // Skia handles drawing in the component, so this method can be removed or adapted if needed
  }
}