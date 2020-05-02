import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';

describe('Status Controller', () => {
  let controller: StatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController]
    }).compile();

    controller = module.get<StatusController>(StatusController);
  });

  it('should return healthy', () => {
    expect(controller.health()).toEqual('healthy');
  });
});
