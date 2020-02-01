import { Pixel } from './pixel';

export class Cluster {
  pixels: Pixel[];

  constructor(pixels: Pixel[]) {
    this.pixels = pixels;
  }

  get center(): Pixel {
    return this.pixels.reduce((p, c) =>
      c.temperature > p.temperature ? c : p
    );
  }

  isNeighboredTo(pixel: Pixel): boolean {
    return (
      this.pixels.find(value => {
        return (
          (value.x >= pixel.x - 1 && value.x <= pixel.x + 1) ||
          (value.y >= pixel.y - 1 && value.y <= pixel.y + 1)
        );
      }) !== undefined
    );
  }
}
