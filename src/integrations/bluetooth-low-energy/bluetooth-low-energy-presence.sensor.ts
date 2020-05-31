import { RoomPresenceDistanceSensor } from '../room-presence/room-presence-distance.sensor';

class BluetoothLowEnergyMeasurement {
  rssi: number;
  measuredPower: number;

  constructor(rssi: number, measuredPower: number) {
    this.rssi = rssi;
    this.measuredPower = measuredPower;
  }
}

export class BluetoothLowEnergyPresenceSensor extends RoomPresenceDistanceSensor {
  measuredValues: { [instance: string]: BluetoothLowEnergyMeasurement } = {};

  handleNewMeasurement(
    instanceName: string,
    rssi: number,
    measuredPower: number,
    distance: number,
    outOfRange: boolean
  ): void {
    this.measuredValues[instanceName] = new BluetoothLowEnergyMeasurement(
      rssi,
      measuredPower
    );
    this.handleNewDistance(instanceName, distance, outOfRange);
  }
}
