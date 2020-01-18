import { Test, TestingModule } from '@nestjs/testing';
import { BluetoothLowEnergyService } from './bluetooth-low-energy.service';

describe('BluetoothLowEnergyService', () => {
  let service: BluetoothLowEnergyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BluetoothLowEnergyService]
    }).compile();

    service = module.get<BluetoothLowEnergyService>(BluetoothLowEnergyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
