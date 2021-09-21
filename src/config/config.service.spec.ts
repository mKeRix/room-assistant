import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import _ from 'lodash';
import yaml from 'js-yaml';
import fs from 'fs';
import c from 'config';

const CONFIG_PASS_FILE = 'src/config/config.service.spec.pass.yml';
const CONFIG_FAIL_FILE = 'src/config/config.service.spec.fail.yml';

describe('ConfigService', () => {
  let service: ConfigService;
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();
    module.useLogger(loggerService);

    service = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should log configuration sources on init', () => {
    service.onModuleInit();

    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('config/test.yml'),
      ConfigService.name
    );
  });

  it('should warn if only default config was found', () => {
    jest.spyOn(c.util, 'getConfigSources').mockReturnValue([
      {
        name: 'defaultDir',
        parsed: undefined,
      },
    ]);
    service.onModuleInit();

    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining(`${process.cwd()}/config/`),
      ConfigService.name
    );
  });

  it('should return values from environment yaml configuration', () => {
    const globalConfig = service.get('global');
    expect(globalConfig.instanceName).toBe('test-instance');
  });

  it('should return default values from TS files', () => {
    const clusterConfig = service.get('cluster');
    expect(clusterConfig.port).toBe(6425);
  });

  const passConfig = yaml.load(fs.readFileSync(CONFIG_PASS_FILE, 'utf8'));

  it('should parse the "pass" configuration file and confirm no errors', () => {
    service.validateConfig(passConfig);
    expect(loggerService.error).toHaveBeenCalledTimes(0);
  });

  it('should parse the "fail" configuration file and confirm known errors', () => {
    const failConfig = yaml.load(fs.readFileSync(CONFIG_FAIL_FILE, 'utf8'));

    // Aliign to known property paths that generate errors in CONFIG_FAIL_FILE
    const errorPaths = [
      `global.integrations[9]`,
      `logger.elasticsearch.enabled`,
      `logger.elasticsearch.auth`,
      `cluster.timeout`,
      `entities.behaviors.debounced_entity.debounce.leading`,
      `bluetoothLowEnergy.minorMask`,
      `bluetoothLowEnergy.tagOverrides.ebef1234567890-55555-333.measuredPower`,
      `bluetoothLowEnergy.tagOverrides.ebef1234567890-55555-333.batteryMask`,
      `bluetoothLowEnergy.tagOverrides.ebef1234567890-55555-444.timeout`,
      `bluetoothLowEnergy.updateFrequency`,
      `bluetoothLowEnergy.updateFrequence`,
      `bluetoothLowEnergy.minDiscoveryLogRssi`,
      `bluetoothClassic.addresses[1]`,
      `bluetoothClassic.addresses[2]`,
      `bluetoothClassic.addresses[3]`,
      `bluetoothClassic.minRssi`,
      `bluetoothClassic.timeoutCycles`,
      `bluetoothClassic.entityOverrides.ebef1234567890-55555-333.id`,
      `omronD6t.heatmap.enabled`,
      `gridEye.maskZeroBasedValues`,
      `gridEye.heatmap.minTemperature`,
      `gridEye.heatmap.rotation`,
      `gpio.binarySensors[1].deviceClass`,
      `shell.sensors[1].switches`,
      `shell.switches`,
      `xiaomiMi.enableMifloraBattery`,
      `xiaomiMi.sensors[0].address`,
      `xiaomiMi.sensors[0].address`,
      `homeAssistant.discoveryPrefix`,
      `homeAssistant.discoveryPrefi`,
      `mqtt.mqttUrl`,
      `mqtt.qos`,
    ];

    service.validateConfig(failConfig);
    expect(loggerService.error).toHaveBeenCalledTimes(errorPaths.length);
    errorPaths.forEach((path) =>
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining(path),
        ConfigService.name
      )
    );
  });

  it('Entities - should successfully parse additional config variants not covered in passConfig', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.entities.behaviors = {};
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);

    cfg.entities.behaviors = { entity_id: {} };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);
  });

  it('Entities - should generate errors on invalid Behaviour types (custom validation)', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.entities.behaviors = { entity_id: 'not_a_behavior_type' };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining(`must be of type object`),
      ConfigService.name
    );

    cfg.entities.behaviors = {
      entity_id: {
        not_a_behavior_key: 'not_a_behavior_value',
      },
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining(`is not allowed`),
      ConfigService.name
    );
  });

  it('Logger - should successfully parse additional config variants not covered in passConfig', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.logger.elasticsearch.auth = {
      apiKey: '1234567',
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);

    cfg.logger.elasticsearch.auth = {
      apiKey: {
        id: 'my id',
        api_key: 'key',
      },
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);
  });

  it('Logger - should generate errors on invalid Auth type (custom validation)', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.logger.elasticsearch.auth = {};
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining(`does not match any of the allowed types`),
      ConfigService.name
    );

    cfg.logger.elasticsearch.auth = {
      apiKey: {},
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining(`does not match any of the allowed types`),
      ConfigService.name
    );
  });

  it('BluetoothClassic - should successfully parse additional Addresses variants not covered in passConfig', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.bluetoothClassic.addresses = [];
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);

    cfg.bluetoothClassic.addresses = [
      '11:22:33:44:55:66',
      'AA:BB:CC:DD:EE:FF',
      'aa:bb:cc:dd:ee:ff',
    ];
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);
  });

  it('BluetoothClassic - should generate errors on invalid MAC addresses (custom validation)', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.bluetoothClassic.addresses = [
      '11:22:33:44:55',
      '11:22:33:44:55:gg',
      '11::33:44:55:66',
    ];
    service.validateConfig(cfg);
    expect(loggerService.error.mock.calls).toEqual([
      expect.arrayContaining([
        expect.stringContaining(
          `does not match the required MAC address format`
        ),
      ]),
      expect.arrayContaining([
        expect.stringContaining(
          `does not match the required MAC address format`
        ),
      ]),
      expect.arrayContaining([
        expect.stringContaining(
          `does not match the required MAC address format`
        ),
      ]),
    ]);
  });

  it('BluetoothClassic - should successfully parse additional minRssi variants not covered in passConfig', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.bluetoothClassic.minRssi = -10;
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);

    cfg.bluetoothClassic.minRssi = {
      '11:22:33:44:55:66': -15,
      '11:22:33:44:55:77': -20,
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);

    cfg.bluetoothClassic.minRssi = {
      default: -25,
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);
  });

  it('BluetoothClassic - should generate errors on invalid minRSSI (custom validation)', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.bluetoothClassic.minRssi = {
      '11:22:33:44:55:66': 30,
      '11:22:33:44:55:GG': -35,
      default: 40,
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining(`does not match any of the allowed types`),
      ConfigService.name
    );
  });

  it('BluetoothClassic - should successfully parse additional EntityOverrides variants not covered in passConfig', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.bluetoothClassic.entityOverrides = {};
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);

    cfg.bluetoothClassic.entityOverrides = { entity_id: {} };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledTimes(0);
  });

  it('BluetoothClassic - should generate errors on invalid EntityOverrides types (custom validation)', () => {
    const cfg = _.cloneDeep(passConfig);

    cfg.bluetoothClassic.entityOverrides = {
      entity_id: 'not_an_override_type',
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining(`must be of type object`),
      ConfigService.name
    );

    cfg.bluetoothClassic.entityOverrides = {
      entity_id: {
        not_an_override_key: 'not_an_override_value',
      },
    };
    service.validateConfig(cfg);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining(`is not allowed`),
      ConfigService.name
    );
  });
});
