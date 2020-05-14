import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import c from 'config';

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
  });

  it('should log configuration sources on init', () => {
    service.onModuleInit();

    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('config/test.yml'),
      ConfigService.name,
      false
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
      ConfigService.name,
      false
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
});
