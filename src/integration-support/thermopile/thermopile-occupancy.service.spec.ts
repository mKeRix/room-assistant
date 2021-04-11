import { ThermopileOccupancyService } from './thermopile-occupancy.service';
import { Pixel } from './pixel';
import { HeatmapOptions } from './thermopile-occupancy.config';
import * as pureimage from 'pureimage';

jest.mock('pureimage', () => ({
  __esModule: true,
  ...jest.requireActual('pureimage'),
}));

class MockThermopileOccupancyService extends ThermopileOccupancyService {
  async getPixelTemperatures(): Promise<number[][]> {
    return undefined;
  }
}

const PRESENCE_TEMPERATURES = [
  [23.0, 21.5, 21.0, 20.25],
  [23.5, 21.2, 20.5, 21.0],
  [21.6, 20.1, 20.3, 20.8],
  [21.0, 20.8, 23.8, 23.5],
];
const ABSENCE_TEMPERATURES = [
  [20.0, 21.5, 21.0, 20.25],
  [21.5, 21.2, 20.5, 21.0],
  [21.6, 20.1, 20.3, 20.8],
  [21.0, 20.8, 20.8, 21.5],
];

describe('ThermopileOccupancyService', () => {
  let service: MockThermopileOccupancyService;
  let testBitmap;
  let testContext;

  beforeEach(async () => {
    jest.clearAllMocks();
    service = new MockThermopileOccupancyService();

    testBitmap = pureimage.make(150, 150);
    testContext = testBitmap.getContext('2d');
    jest.spyOn(testBitmap, 'getContext').mockReturnValue(testContext);
    jest.spyOn(pureimage, 'make').mockReturnValue(testBitmap);
  });

  it('should find all pixels that are above the delta threshold', () => {
    const pixels = service.findRelevantPixels(PRESENCE_TEMPERATURES, 1.5);
    expect(pixels).toStrictEqual([
      new Pixel(0, 0, 23),
      new Pixel(0, 1, 23.5),
      new Pixel(2, 3, 23.8),
      new Pixel(3, 3, 23.5),
    ]);
  });

  it('should cluster relevant pixels together if they are neighbors', () => {
    const pixels = [
      new Pixel(1, 1, 23),
      new Pixel(2, 1, 23),
      new Pixel(0, 3, 23),
    ];
    const clusters = service.clusterPixels(pixels);
    expect(clusters).toHaveLength(2);
  });

  it('should pick the pixel with the highest temperatures as cluster center', () => {
    const center = new Pixel(1, 2, 23.4);
    const pixels = [new Pixel(2, 2, 23.1), center, new Pixel(1, 3, 23.2)];
    const clusters = service.clusterPixels(pixels);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].center).toBe(center);
  });

  it('should get the coordinates for humans present in the view', async () => {
    const coordinates = await service.getCoordinates(
      PRESENCE_TEMPERATURES,
      1.5
    );
    expect(coordinates).toStrictEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it('should return no coordinates if no human is in the view', async () => {
    const coordinates = await service.getCoordinates(ABSENCE_TEMPERATURES, 1.5);
    expect(coordinates).toHaveLength(0);
  });

  it('should choose canvas size based on parameters', async () => {
    const makeSpy = jest.spyOn(pureimage, 'make');

    await service.generateHeatmap(PRESENCE_TEMPERATURES, undefined, 250, 250);

    expect(makeSpy).toHaveBeenCalledWith(250, 250);
  });

  it('should create rectangles with fonts for each pixel', async () => {
    const translateSpy = jest.spyOn(testContext, 'translate');
    const rectSpy = jest.spyOn(testContext, 'fillRect');
    const textSpy = jest.spyOn(testContext, 'fillText');

    await service.generateHeatmap(PRESENCE_TEMPERATURES, undefined, 150, 150);

    expect(translateSpy).toHaveBeenCalledWith(19, 19);
    expect(rectSpy).toHaveBeenCalledTimes(16);
    expect(rectSpy).toHaveBeenCalledWith(0, 0, 38, 38);
    expect(rectSpy).toHaveBeenCalledWith(38, 38, 38, 38);
    expect(textSpy).toHaveBeenCalledTimes(16);
    expect(textSpy).toHaveBeenCalledWith(
      PRESENCE_TEMPERATURES[0][0].toFixed(1),
      0,
      0
    );
  });

  it('should not draw the temperature text if option is disabled', async () => {
    const textSpy = jest.spyOn(testContext, 'fillText');

    const heatmapOptions = new HeatmapOptions();
    heatmapOptions.drawTemperatures = false;
    await service.generateHeatmap(
      PRESENCE_TEMPERATURES,
      heatmapOptions,
      150,
      150
    );

    expect(textSpy).not.toHaveBeenCalled();
  });

  it('should output a jpeg image buffer', async () => {
    const outputSpy = jest.spyOn(pureimage, 'encodeJPEGToStream');

    await service.generateHeatmap(PRESENCE_TEMPERATURES);

    expect(outputSpy).toHaveBeenCalledWith(testBitmap, expect.anything(), 100);
  });

  it('should allow the output to be rotated', async () => {
    const textSpy = jest.spyOn(testContext, 'fillText');

    await service.generateHeatmap(
      PRESENCE_TEMPERATURES,
      {
        enabled: true,
        rotation: 90,
        minTemperature: 16,
        maxTemperature: 30,
        drawTemperatures: true,
      },
      100,
      200
    );

    expect(textSpy).toHaveBeenCalledWith(
      PRESENCE_TEMPERATURES[3][0].toFixed(1),
      0,
      0
    );
  });
});
