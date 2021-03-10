import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import * as mathjs from 'mathjs';
import { Peripheral } from '@abandonware/noble';
import { EntitiesService } from '../../entities/entities.service';
import { ConfigService } from '../../config/config.service';
import {
  AdTemplateConfig,
  AdTemplateDeviceOptions,
  AdTemplateSensorOptions,
} from './ad-template.config';
import { DISTRIBUTED_DEVICE_ID } from '../home-assistant/home-assistant.const';
import { makeId } from '../../util/id';
import { Sensor } from '../../entities/sensor';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import { BluetoothService } from '../bluetooth/bluetooth.service';

interface templateScope {
  id: string;
  uuid: string;
  address: string;
  addressType: string;
  connectable: boolean;
  rssi: number;
  state:
    | 'error'
    | 'connecting'
    | 'connected'
    | 'disconnecting'
    | 'disconnected';
  localName: string;
  serviceDataUuid: string[];
  serviceData: number[][];
  txPowerLevel: number;
  manufacturerData: number[];
  serviceUuids: string[];
}

interface templateHelper {
  config: string;
  code: mathjs.EvalFunction;
}

interface templateSensor {
  config: AdTemplateSensorOptions;
  code: mathjs.EvalFunction;
}

@Injectable()
export class AdTemplateService implements OnModuleInit, OnApplicationBootstrap {
  private config: AdTemplateConfig;
  private helpers: templateHelper[] = [];
  private sensors: templateSensor[] = [];
  private readonly logger: Logger;

  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService
  ) {
    this.logger = new Logger(AdTemplateService.name);
    this.config = this.configService.get('adTemplate');
    this.config.devices.forEach((device) => {
      this.helpers[device.address] = [];
      this.sensors[device.address] = [];
      device.helpers?.forEach((helper) => {
        this.helpers[device.address].push({
          config: helper,
          code: mathjs.compile(helper),
        });
      });
      device.sensors?.forEach((sensor) => {
        this.sensors[device.address].push({
          config: sensor,
          code: mathjs.compile(sensor.state),
        });
      });
    });
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  onModuleInit(): void {
    if (this.config.devices.length == 0) {
      this.logger.warn(
        'No device entries in the config, so no sensors will be created!'
      );
    }
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.bluetoothService.onLowEnergyDiscovery(this.handleDiscovery.bind(this));
  }

  /**
   * Filters found BLE peripherals and publishes new readings to sensors, depending on configuration.
   *
   * @param peripheral - BLE peripheral
   */
  handleDiscovery(peripheral: Peripheral): void {
    const { advertisement, id } = peripheral || {};
    const device = this.config.devices.find((i) => i.address === id);
    if (!device) {
      return;
    }

    const scope: templateScope = {
      id: id,
      uuid: peripheral.uuid,
      address: peripheral.address,
      addressType: peripheral.addressType,
      connectable: peripheral.connectable,
      rssi: peripheral.rssi,
      state: peripheral.state,
      localName: advertisement.localName,
      serviceDataUuid: advertisement.serviceData.map((entry) => entry.uuid),
      serviceData: advertisement.serviceData.map((entry) => [...entry.data]),
      txPowerLevel: advertisement.txPowerLevel,
      manufacturerData: [...(advertisement.manufacturerData ?? [])],
      serviceUuids: [...(advertisement.serviceUuids ?? [])],
    };

    // Add helpers into the template's evaluation scope
    this.helpers[id].forEach((helper: templateHelper) => {
      try {
        helper.code.evaluate(scope);
      } catch (error) {
        this.logger.error(
          `${device.name} failed to evaluate \"${helper.config}\" - ${error}`
        );
        return;
      }
    });

    this.sensors[id].forEach((sensor: templateSensor) => {
      let value;
      try {
        value = sensor.code.evaluate(scope);
      } catch (error) {
        this.logger.error(
          `${device.name} failed to evaluate \"${sensor.config.state}\" - ${error}`
        );
        return;
      }

      if (value === null) return;

      this.publishSensor(device, sensor.config, value);
    });
  }

  publishSensor(
    device: AdTemplateDeviceOptions,
    sensor: AdTemplateSensorOptions,
    state: number
  ): void {
    const unique_id = makeId(`AdTemplate ${device.address} ${sensor.name}`);
    let entity = this.entitiesService.get(unique_id);
    if (!entity) {
      const customizations: Array<EntityCustomization<any>> = [
        {
          for: SensorConfig,
          overrides: {
            deviceClass: sensor.deviceClass,
            unitOfMeasurement: sensor.unitOfMeasurement,
            icon: sensor.icon,
            device: {
              identifiers: device.address,
              name: device.name,
              viaDevice: DISTRIBUTED_DEVICE_ID,
            },
          },
        },
      ];
      entity = this.entitiesService.add(
        new Sensor(unique_id, `${device.name} ${sensor.name}`, true),
        customizations
      ) as Sensor;
    }
    entity.state = state;
    this.logger.log(`${device.name} ${sensor.name}: ${state}`);
  }
}
