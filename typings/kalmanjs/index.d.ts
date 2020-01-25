declare module 'kalmanjs' {
  export default class KalmanFilter {
    constructor(options?: FilterOptions);
    filter(z: number, u?: number): number;
    predict(u?: number): number;
    uncertainty(): number;
    lastMeasurement(): number;
    setMeasurementNoise(noise: number): void;
    setProcessNoise(noise: number): void;
  }

  interface FilterOptions {
    R?: number;
    Q?: number;
    A?: number;
    B?: number;
    C?: number;
  }
}
