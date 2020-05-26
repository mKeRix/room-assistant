import KalmanFilter from 'kalmanjs';

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructable = new (...args: any[]) => object;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
export function KalmanFilterable<BC extends Constructable>(
  Base: BC,
  R = 1,
  Q = 1
) {
  return class extends Base {
    kalmanFilterMap: Map<string, KalmanFilter> = new Map<
      string,
      KalmanFilter
    >();

    /**
     * Smoothes a given value using a Kalman filter.
     * Optionally can use different filter instances per passed id.
     *
     * @param value - Value to be filtered
     * @param id - ID to group values together in separated filters
     * @returns Filtered value
     */
    kalmanFilter(value: number, id = 'default'): number {
      if (this.kalmanFilterMap.has(id)) {
        return this.kalmanFilterMap.get(id).filter(value);
      } else {
        const kalman = new KalmanFilter({ R, Q });
        this.kalmanFilterMap.set(id, kalman);
        return kalman.filter(value);
      }
    }
  };
}
