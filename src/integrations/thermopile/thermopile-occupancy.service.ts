import { Pixel } from './pixel';
import * as math from 'mathjs';
import { Cluster } from './cluster';

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
   * @param deltaThreshold - Minimum difference between avg and pixel temperature to consider it human
   * @returns [x, y] coordinates of humans in field of view
   */
  async getCoordinates(deltaThreshold: number): Promise<number[][]> {
    const temperatures = await this.getPixelTemperatures();
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
}
