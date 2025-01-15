export class Sprite {
  constructor(private color: string, private spriteWidth: number, private spriteHeight: number) {}

  // Skia handles drawing directly in the component, so this method can be removed or adapted if needed
  public draw(ctx: any, x: number, y: number) {
    // Intentionally left blank or refactored for Skia usage
  }
}