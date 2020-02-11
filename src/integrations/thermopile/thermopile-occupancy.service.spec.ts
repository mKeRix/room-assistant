import { ThermopileOccupancyService } from './thermopile-occupancy.service';
import { Pixel } from './pixel';

class MockThermopileOccupancySensor extends ThermopileOccupancyService {
  async getPixelTemperatures(): Promise<number[][]> {
    return undefined;
  }
}

const PRESENCE_TEMPERATURES = [
  [23.0, 21.5, 21.0, 20.25],
  [23.5, 21.2, 20.5, 21.0],
  [21.6, 20.1, 20.3, 20.8],
  [21.0, 20.8, 23.8, 23.5]
];
const ABSENCE_TEMPERATURES = [
  [20.0, 21.5, 21.0, 20.25],
  [21.5, 21.2, 20.5, 21.0],
  [21.6, 20.1, 20.3, 20.8],
  [21.0, 20.8, 20.8, 21.5]
];

describe('ThermopileOccupancySensor', () => {
  const mockSensor = new MockThermopileOccupancySensor();

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should find all pixels that are above the delta threshold', () => {
    const pixels = mockSensor.findRelevantPixels(PRESENCE_TEMPERATURES, 1.5);
    expect(pixels).toStrictEqual([
      new Pixel(0, 0, 23),
      new Pixel(0, 1, 23.5),
      new Pixel(2, 3, 23.8),
      new Pixel(3, 3, 23.5)
    ]);
  });

  it('should cluster relevant pixels together if they are neighbors', () => {
    const pixels = [
      new Pixel(1, 1, 23),
      new Pixel(2, 1, 23),
      new Pixel(0, 3, 23)
    ];
    const clusters = mockSensor.clusterPixels(pixels);
    expect(clusters).toHaveLength(2);
  });

  it('should pick the pixel with the highest temperatures as cluster center', () => {
    const center = new Pixel(1, 2, 23.4);
    const pixels = [new Pixel(2, 2, 23.1), center, new Pixel(1, 3, 23.2)];
    const clusters = mockSensor.clusterPixels(pixels);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].center).toBe(center);
  });

  it('should get the coordinates for humans present in the view', async () => {
    jest
      .spyOn(mockSensor, 'getPixelTemperatures')
      .mockResolvedValue(PRESENCE_TEMPERATURES);
    const coordinates = await mockSensor.getCoordinates(1.5);
    expect(coordinates).toStrictEqual([
      [0, 1],
      [2, 3]
    ]);
  });

  it('should return no coordinates if no human is in the view', async () => {
    jest
      .spyOn(mockSensor, 'getPixelTemperatures')
      .mockResolvedValue(ABSENCE_TEMPERATURES);
    const coordinates = await mockSensor.getCoordinates(1.5);
    expect(coordinates).toHaveLength(0);
  });
});
