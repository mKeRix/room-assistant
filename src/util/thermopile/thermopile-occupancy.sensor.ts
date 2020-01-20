import { Pixel } from './pixel';
import * as math from 'mathjs';
import { Cluster } from './cluster';

export abstract class ThermopileOccupancySensor {
  abstract async getPixelTemperatures(): Promise<number[][]>;

  async getCoordinates(deltaThreshold: number): Promise<number[][]> {
    const temperatures = await this.getPixelTemperatures();
    const relevantPixels = this.findRelevantPixels(
      temperatures as number[][],
      deltaThreshold
    );
    const clusters = this.clusterPixels(relevantPixels);

    return clusters.map(cluster => [cluster.center.x, cluster.center.y]);
  }

  findRelevantPixels(data: number[][], deltaThreshold: number): Pixel[] {
    const mean = math.mean(data);
    const threshold = mean + deltaThreshold;

    const relevantPixels: Pixel[] = [];
    for (const [x, row] of data.entries()) {
      for (const [y, value] of row.entries()) {
        if (value >= threshold) {
          relevantPixels.push(new Pixel(x, y, value));
        }
      }
    }

    return relevantPixels;
  }

  clusterPixels(pixels: Pixel[]): Cluster[] {
    const clusters: Cluster[] = [];
    pixels.forEach(pixel => {
      const neighbor = clusters.find(cluster => cluster.isNeighboredTo(pixel));
      if (neighbor === undefined) {
        clusters.push(new Cluster([pixel]));
      } else {
        neighbor.pixels.push(pixel);
      }
    });

    return clusters;
  }
}
