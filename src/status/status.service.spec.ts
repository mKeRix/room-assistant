import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { ConfigModule } from '../config/config.module';
import { EntitiesModule } from '../entities/entities.module';
import { ClusterModule } from '../cluster/cluster.module';
import { EntitiesService } from '../entities/entities.service';
import { ClusterService } from '../cluster/cluster.service';
import { Sensor } from '../entities/sensor';

describe('StatusService', () => {
  let service: StatusService;
  const entitiesService = {
    add: jest.fn(),
  };
  const clusterService = {
    on: jest.fn(),
    nodes: jest.fn(),
    leader: jest.fn(),
    quorumReached: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, EntitiesModule, ClusterModule],
      providers: [StatusService],
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<StatusService>(StatusService);
  });

  it('should register new sensors on bootstrap', () => {
    jest
      .spyOn(service, 'updateClusterSizeSensor')
      .mockImplementation(() => undefined);
    jest
      .spyOn(service, 'updateClusterLeaderSensor')
      .mockImplementation(() => undefined);

    service.onApplicationBootstrap();

    expect(entitiesService.add).toHaveBeenCalledTimes(2);
    expect(entitiesService.add).toHaveBeenCalledWith(
      new Sensor('status-cluster-size', 'test-instance Cluster Size'),
      expect.any(Array)
    );
    expect(entitiesService.add).toHaveBeenCalledWith(
      new Sensor('status-cluster-leader', 'test-instance Cluster Leader'),
      expect.any(Array)
    );
  });

  it('should update sensors on bootstrap', () => {
    const sizeSpy = jest
      .spyOn(service, 'updateClusterSizeSensor')
      .mockImplementation(() => undefined);
    const leaderSpy = jest
      .spyOn(service, 'updateClusterLeaderSensor')
      .mockImplementation(() => undefined);

    service.onApplicationBootstrap();

    expect(sizeSpy).toHaveBeenCalledTimes(1);
    expect(leaderSpy).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to the cluster service events on boostrap', () => {
    jest
      .spyOn(service, 'updateClusterSizeSensor')
      .mockImplementation(() => undefined);
    jest
      .spyOn(service, 'updateClusterLeaderSensor')
      .mockImplementation(() => undefined);

    service.onApplicationBootstrap();

    expect(clusterService.on).toHaveBeenCalledTimes(3);
  });

  it('should update the cluster size sensor', () => {
    const sensor = new Sensor('cluster-size', 'Cluster Size');

    jest
      .spyOn(service, 'updateClusterLeaderSensor')
      .mockImplementation(() => undefined);
    entitiesService.add.mockReturnValue(sensor);
    clusterService.nodes.mockReturnValue({});
    service.onApplicationBootstrap();

    clusterService.nodes.mockReturnValue({
      node1: {},
      node2: {},
    });

    service.updateClusterSizeSensor();

    expect(sensor.state).toBe(2);
    expect(sensor.attributes.nodes).toStrictEqual(['node1', 'node2']);
  });

  it('should update the cluster leader sensor', () => {
    const sensor = new Sensor('cluster-leader', 'Cluster Leader');

    jest
      .spyOn(service, 'updateClusterSizeSensor')
      .mockImplementation(() => undefined);
    entitiesService.add.mockReturnValue(sensor);
    clusterService.leader.mockReturnValue({
      id: 'node1',
    });
    service.onApplicationBootstrap();

    clusterService.leader.mockReturnValue({
      id: 'node2',
    });
    clusterService.quorumReached.mockReturnValue(true);

    service.updateClusterLeaderSensor();

    expect(sensor.state).toBe('node2');
    expect(sensor.attributes.quorumReached).toBeTruthy();
  });
});
