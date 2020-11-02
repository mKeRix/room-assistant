import { Pixel } from './pixel';
import * as math from 'mathjs';
import { Cluster } from './cluster';
import * as _ from 'lodash';
import { HeatmapOptions } from './thermopile-occupancy.config';
import * as PImg from 'pureimage';
import { WritableStreamBuffer } from 'stream-buffers';
import * as path from 'path';
import { rotate } from '2d-array-rotation';

export type RotationOption = 0 | 90 | 180 | 270;

const OPEN_SANS = PImg.registerFont(
  path.resolve(__dirname, 'OpenSans-Regular.ttf'),
  'Open Sans',
  400,
  'normal'
);
OPEN_SANS.loadSync();

export abstract class ThermopileOccupancyService {
  /**
   * Gets all temperatures in the sensor field of view.
   *
   * @returns Matrix of temperatures
   */
  abstract async getPixelTemperatures(): Promise<number[][]>;

  /**
   * Calculates the coordinates with human presence based on the temperatures.
   *
   * @param temperatures - Matrix of temperatures to analyze
   * @param deltaThreshold - Minimum difference between avg and pixel temperature to consider it human
   * @returns [x, y] coordinates of humans in field of view
   */
  async getCoordinates(
    temperatures: number[][],
    deltaThreshold: number
  ): Promise<number[][]> {
    const relevantPixels = this.findRelevantPixels(
      temperatures as number[][],
      deltaThreshold
    );
    const clusters = this.clusterPixels(relevantPixels);

    return clusters.map((cluster) => [cluster.center.x, cluster.center.y]);
  }

  /**
   * Filters out the relevant pixels for presence detection.
   *
   * @param data - Matrix of all temperatures in FOV
   * @param deltaThreshold - Minimum difference between avg and pixel temperature to consider it human
   * @returns Array of relevant pixels
   */
  findRelevantPixels(data: number[][], deltaThreshold: number): Pixel[] {
    const mean = math.mean(data);
    const threshold = mean + deltaThreshold;

    const relevantPixels: Pixel[] = [];
    for (const [y, row] of data.entries()) {
      for (const [x, value] of row.entries()) {
        if (value >= threshold) {
          relevantPixels.push(new Pixel(x, y, value));
        }
      }
    }

    return relevantPixels;
  }

  /**
   * Clusters a list of pixels by their locations. Neighbors are grouped together.
   *
   * @param pixels - Array of pixels to be clustered
   * @returns Calculated clusters containing all input pixels
   */
  clusterPixels(pixels: Pixel[]): Cluster[] {
    const clusters: Cluster[] = [];
    pixels.forEach((pixel) => {
      const neighbor = clusters.find((cluster) =>
        cluster.isNeighboredTo(pixel)
      );
      if (neighbor === undefined) {
        clusters.push(new Cluster([pixel]));
      } else {
        neighbor.pixels.push(pixel);
      }
    });

    return clusters;
  }

  /**
   * Generates a blue to red heatmap image of the given temperatures.
   *
   * @param temperatures - Matrix of temperatures to be visualized
   * @param options - Options for tuning the output
   * @param width - Width of the output image in px
   * @param height - Height of the output image in px
   * @returns Buffer of JPEG image data
   */
  async generateHeatmap(
    temperatures: number[][],
    options = new HeatmapOptions(),
    width = 280,
    height = 280
  ): Promise<Buffer> {
    const segmentHeight = Math.round(height / temperatures.length);
    const segmentWidth = Math.round(width / temperatures[0].length);
    const canvas = [90, 270].includes(options.rotation)
      ? PImg.make(height, width)
      : PImg.make(width, height);
    const ctx = canvas.getContext('2d');

    let normed = math.divide(
      math.subtract(temperatures, options.minTemperature),
      options.maxTemperature - options.minTemperature
    ) as number[][];
    normed = rotate(normed, options.rotation);

    for (const [y, row] of normed.entries()) {
      for (const [x, value] of row.entries()) {
        const pixelXOrigin = x * segmentWidth;
        const pixelXCenter = pixelXOrigin + segmentWidth / 2;
        const pixelYOrigin = y * segmentHeight;
        const pixelYCenter = pixelYOrigin + segmentHeight / 2;

        ThermopileOccupancyService.drawPixel(
          ctx,
          pixelXOrigin,
          pixelYOrigin,
          segmentWidth,
          segmentHeight,
          value
        );
        if (options.drawTemperatures) {
          ThermopileOccupancyService.drawTemperature(
            ctx,
            pixelXCenter,
            pixelYCenter,
            segmentWidth,
            temperatures[x][y]
          );
        }
      }
    }

    const outputBuffer = new WritableStreamBuffer();
    await PImg.encodeJPEGToStream(canvas, outputBuffer, 100);

    return outputBuffer.getContents();
  }

  /**
   * Draws a rectangle representing the pixel temperature with a color.
   *
   * @param ctx - 2d context of the canvas to draw on
   * @param xOrigin - x coordinate of the pixel top-left origin
   * @param yOrigin - y coordinate of the pixel top-left origin
   * @param width - width of the pixel
   * @param height - height of the pixel
   * @param normedValue - value representing the temperature within a normed range (between 0 and 1)
   */
  private static drawPixel(
    ctx: CanvasRenderingContext2D,
    xOrigin: number,
    yOrigin: number,
    width: number,
    height: number,
    normedValue: number
  ): void {
    const h = 1 - _.clamp(normedValue, 0, 1);
    const rgb = this.hslToRgb(h, 1, 0.5);
    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    ctx.fillRect(xOrigin, yOrigin, width, height);
  }

  /**
   * Draws a text representing the temperature onto a pixel.
   *
   * @param ctx - 2d context of the canvas to draw on
   * @param xCenter - x coordinate of the pixel center
   * @param yCenter - y coordinate of the pixel center
   * @param width - width of the pixel
   * @param temperature - temperature value to draw
   */
  private static drawTemperature(
    ctx: CanvasRenderingContext2D,
    xCenter: number,
    yCenter: number,
    width: number,
    temperature: number
  ): void {
    ctx.save();
    ctx.font = `${Math.round(width / 2.7)}px 'Open Sans'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.translate(xCenter, yCenter);
    ctx.fillText(temperature.toFixed(1), 0, 0);
    ctx.restore();
  }

  /**
   * Converts an HSL color value to RGB.
   * Taken from https://gist.github.com/mjackson/5311256.
   *
   * @param h - Hue between 0 and 1
   * @param s - Saturation between 0 and 1
   * @param l - Lightness between 0 and 1
   * @returns RGB representation as array with 3 elements
   */
  private static hslToRgb(h: number, s: number, l: number): number[] {
    let r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = this.hueToRgb(p, q, h + 1 / 3);
      g = this.hueToRgb(p, q, h);
      b = this.hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private static hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
}
