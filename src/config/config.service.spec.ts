import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService]
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should return values from environment yaml configuration', () => {
    const globalConfig = service.get('global');
    expect(globalConfig.instanceName).toBe('test-instance');
  });

  it('should return default values from TS files', () => {
    const globalConfig = service.get('global');
    expect(globalConfig.integrations).toHaveLength(1);
    expect(globalConfig.integrations[0]).toBe('bluetoothLowEnergy');
  });
});
