import { Pixel } from './pixel';
import * as math from 'mathjs';
import { Cluster } from './cluster';
import * as _ from 'lodash';
import { Logger } from '@nestjs/common';
import { HeatmapOptions } from './thermopile-occupancy.config';

let nodeCanvas;
try {
  nodeCanvas = require('canvas');
} catch (e) {
  Logger.error(e.message, e.stack, 'ThermopileOccupancyService');
  nodeCanvas = undefined;
}

export type RotationOption = 0 | 90 | 180 | 270;

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
   * Checks if a heatmap can be generated.
   *
   * @returns Whether dependencies for generation are met or not
   */
  isHeatmapAvailable(): boolean {
    return nodeCanvas !== undefined;
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
    if (!this.isHeatmapAvailable()) {
      throw new Error(
        'Generating a heatmap requires the canvas optional dependency'
      );
    }

    const segmentHeight = Math.round(height / temperatures.length);
    const segmentWidth = Math.round(width / temperatures[0].length);
    const canvas = [90, 270].includes(options.rotation)
      ? nodeCanvas.createCanvas(height, width)
      : nodeCanvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const rotationRad = (options.rotation * Math.PI) / 180;
    ctx.rotate(rotationRad);

    const normed = math.divide(
      math.subtract(temperatures, options.minTemperature),
      options.maxTemperature - options.minTemperature
    ) as number[][];

    for (const [y, row] of normed.entries()) {
      for (const [x, value] of row.entries()) {
        const pixelXOrigin = -canvas.width / 2 + x * segmentWidth;
        const pixelXCenter = pixelXOrigin + segmentWidth / 2;
        const pixelYOrigin = -canvas.height / 2 + y * segmentHeight;
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
            rotationRad,
            temperatures[x][y]
          );
        }
      }
    }

    return canvas.toBuffer('image/jpeg', {
      quality: 1,
    });
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
    const h = (1 - _.clamp(normedValue, 0, 1)) * 240;
    ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
    ctx.fillRect(xOrigin, yOrigin, width, height);
  }

  /**
   * Draws a text representing the temperature onto a pixel.
   *
   * @param ctx - 2d context of the canvas to draw on
   * @param xCenter - x coordinate of the pixel center
   * @param yCenter - y coordinate of the pixel center
   * @param width - width of the pixel
   * @param rotationRad - rotation that is used for the context in rad
   * @param temperature - temperature value to draw
   */
  private static drawTemperature(
    ctx: CanvasRenderingContext2D,
    xCenter: number,
    yCenter: number,
    width: number,
    rotationRad: number,
    temperature: number
  ): void {
    ctx.save();
    ctx.font = `${Math.round(width / 2.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.translate(xCenter, yCenter);
    ctx.rotate(-rotationRad);
    ctx.fillText(temperature.toFixed(1), 0, 0);
    ctx.restore();
  }
}
