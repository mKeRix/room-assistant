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
    width = 150,
    height = 150
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
    ctx.rotate((options.rotation * Math.PI) / 180);

    const normed = math.divide(
      math.subtract(temperatures, options.minTemperature),
      options.maxTemperature - options.minTemperature
    ) as number[][];

    for (const [y, row] of normed.entries()) {
      for (const [x, value] of row.entries()) {
        const h = (1 - _.clamp(value, 0, 1)) * 240;
        ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
        ctx.fillRect(
          -canvas.width / 2 + x * segmentWidth,
          -canvas.height / 2 + y * segmentHeight,
          segmentWidth,
          segmentHeight
        );
      }
    }

    return canvas.toBuffer('image/jpeg', {
      quality: 1,
    });
  }
}
