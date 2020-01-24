import { Test, TestingModule } from '@nestjs/testing';
import { BluetoothLowEnergyService } from './bluetooth-low-energy.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ClusterModule } from '../../cluster/cluster.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BluetoothLowEnergyDistributedService } from './bluetooth-low-energy-distributed.service';
import { ClusterService } from '../../cluster/cluster.service';
import { EntitiesService } from '../../entities/entities.service';

jest.mock('@abandonware/noble', () => jest.fn(), { virtual: true });

describe('BluetoothLowEnergyService', () => {
  let service: BluetoothLowEnergyService;
  const clusterService = jest.fn();
  const entitiesService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        ClusterModule,
        EntitiesModule,
        ScheduleModule.forRoot()
      ],
      providers: [
        BluetoothLowEnergyService,
        BluetoothLowEnergyDistributedService
      ]
    })
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .compile();

    service = module.get<BluetoothLowEnergyService>(BluetoothLowEnergyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
