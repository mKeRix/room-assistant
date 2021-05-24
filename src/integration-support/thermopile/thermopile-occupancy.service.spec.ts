import { ThermopileOccupancyService } from './thermopile-occupancy.service';
import { Pixel } from './pixel';
import { HeatmapOptions } from './thermopile-occupancy.config';
import { mocked } from 'ts-jest/utils';
import NodeCanvas from 'canvas';

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

const mockedNodeCanvas = mocked(NodeCanvas);

describe('ThermopileOccupancyService', () => {
  let service: MockThermopileOccupancyService;

  beforeEach(async () => {
    jest.clearAllMocks();
    service = new MockThermopileOccupancyService();
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

  it('should throw an error when trying to generate a heatmap without the dependencies', async () => {
    jest.spyOn(service, 'isHeatmapAvailable').mockReturnValue(false);

    await expect(
      service.generateHeatmap(PRESENCE_TEMPERATURES)
    ).rejects.toThrowError(Error);
  });

  it('should choose canvas size based on parameters', async () => {
    await service.generateHeatmap(PRESENCE_TEMPERATURES, undefined, 250, 250);

    expect(mockedNodeCanvas.createCanvas).toHaveBeenCalledWith(250, 250);
  });

  it('should create rectangles with fonts for each pixel', async () => {
    await service.generateHeatmap(PRESENCE_TEMPERATURES, undefined, 150, 150);

    const mockedCanvas = mockedNodeCanvas.createCanvas.mock.results[0].value;
    const mockedContext = mockedCanvas.getContext.mock.results[0].value;

    expect(mockedContext.translate).toHaveBeenCalledWith(19, 19);
    expect(mockedContext.fillRect).toHaveBeenCalledTimes(16);
    expect(mockedContext.fillRect).toHaveBeenCalledWith(0, 0, 38, 38);
    expect(mockedContext.fillRect).toHaveBeenCalledWith(38, 38, 38, 38);
    expect(mockedContext.fillText).toHaveBeenCalledTimes(16);
    expect(mockedContext.fillText).toHaveBeenCalledWith(
      PRESENCE_TEMPERATURES[0][0].toFixed(1),
      0,
      0
    );
  });

  it('should not draw the temperature text if option is disabled', async () => {
    const heatmapOptions = new HeatmapOptions();
    heatmapOptions.drawTemperatures = false;
    await service.generateHeatmap(
      PRESENCE_TEMPERATURES,
      heatmapOptions,
      150,
      150
    );

    const mockedCanvas = mockedNodeCanvas.createCanvas.mock.results[0].value;
    const mockedContext = mockedCanvas.getContext.mock.results[0].value;

    expect(mockedContext.fillText).not.toHaveBeenCalled();
  });

  it('should output a jpeg image buffer', async () => {
    await service.generateHeatmap(PRESENCE_TEMPERATURES);

    const mockedCanvas = mockedNodeCanvas.createCanvas.mock.results[0].value;

    expect(mockedCanvas.toBuffer).toHaveBeenCalledWith('image/png');
  });

  it('should allow the output to be rotated', async () => {
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

    const mockedCanvas = mockedNodeCanvas.createCanvas.mock.results[0].value;
    const mockedContext = mockedCanvas.getContext.mock.results[0].value;

    expect(mockedContext.fillText).toHaveBeenCalledWith(
      PRESENCE_TEMPERATURES[3][0].toFixed(1),
      0,
      0
    );
  });
});
