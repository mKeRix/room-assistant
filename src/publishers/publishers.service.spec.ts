import { Test, TestingModule } from '@nestjs/testing';
import { PublishersService } from './publishers.service';
import { HomeAssistantService } from '../home-assistant/home-assistant.service';
import { ClusterService } from '../cluster/cluster.service';
import { PUBLISHER_SERVICES } from './publishers.constants';
import { Sensor } from '../entities/sensor.entity';
import { ClusterModule } from '../cluster/cluster.module';
import { ConfigModule } from '../config/config.module';

describe('PublishersService', () => {
  let service: PublishersService;
  const homeAssistantService = {
    handleNewEntity: jest.fn(),
    handleNewState: jest.fn(),
    handleNewAttributes: jest.fn()
  };
  const clusterService = {
    isLeader: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClusterModule, ConfigModule],
      providers: [
        {
          provide: HomeAssistantService,
          useValue: homeAssistantService
        },
        {
          provide: PUBLISHER_SERVICES,
          useValue: [homeAssistantService]
        },
        PublishersService
      ]
    })
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<PublishersService>(PublishersService);
    jest.resetAllMocks();
  });

  it('should pass along new entities to all loaded publisher services', () => {
    const entity = new Sensor('test_sensor', 'Test');

    service.publishNewEntity(entity);
    expect(homeAssistantService.handleNewEntity).toHaveBeenCalledWith(entity);
  });

  it('should pass along state updates to all loaded publisher services', () => {
    service.publishNewState('test_sensor', 5);
    expect(homeAssistantService.handleNewState).toHaveBeenCalledWith(
      'test_sensor',
      5,
      false
    );
  });

  it('should only pass along state updates for distributed entities if leader', () => {
    clusterService.isLeader.mockReturnValue(true).mockReturnValueOnce(false);

    service.publishNewState('distributed_sensor', 'follower', true);
    expect(homeAssistantService.handleNewState).not.toHaveBeenCalled();
    service.publishNewState('distributed_sensor', 'leader', true);
    expect(homeAssistantService.handleNewState).toHaveBeenCalledWith(
      'distributed_sensor',
      'leader',
      true
    );
  });

  it('should pass along attribute updates to all loaded publisher services', () => {
    service.publishNewAttributes('test_sensor', { awesome: true });
    expect(homeAssistantService.handleNewAttributes).toHaveBeenCalledWith(
      'test_sensor',
      { awesome: true },
      false
    );
  });

  it('should only pass along attribute updates for distributed entitites if leader', () => {
    clusterService.isLeader.mockReturnValue(true).mockReturnValueOnce(false);

    service.publishNewAttributes('distributed_sensor', {}, true);
    expect(homeAssistantService.handleNewAttributes).not.toHaveBeenCalled();
    service.publishNewAttributes(
      'distributed_sensor',
      { name: 'John', lastName: 'Doe' },
      true
    );
    expect(homeAssistantService.handleNewAttributes).toHaveBeenCalledWith(
      'distributed_sensor',
      { name: 'John', lastName: 'Doe' },
      true
    );
  });
});
