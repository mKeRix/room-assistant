import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EntitiesService } from '../entities/entities.service';
import { ClusterService } from '../cluster/cluster.service';
import { ConfigService } from '../config/config.service';
import { Sensor } from '../entities/sensor';
import { EntityCustomization } from '../entities/entity-customization.interface';
import { SensorConfig } from '../integrations/home-assistant/sensor-config';

@Injectable()
export class StatusService implements OnApplicationBootstrap {
  private clusterSizeSensor: Sensor;
  private clusterLeaderSensor: Sensor;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly clusterService: ClusterService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.clusterSizeSensor = this.createClusterSizeSensor();
    this.clusterLeaderSensor = this.createClusterLeaderSensor();

    this.updateClusterSizeSensor();
    this.updateClusterLeaderSensor();

    this.clusterService.on('added', this.updateClusterSizeSensor.bind(this));
    this.clusterService.on('removed', this.updateClusterSizeSensor.bind(this));
    this.clusterService.on(
      'elected',
      this.updateClusterLeaderSensor.bind(this)
    );
    this.clusterService.on('leader', this.updateClusterLeaderSensor.bind(this));
  }

  /**
   * Updates the cluster size sensor based on the currently connected nodes.
   */
  updateClusterSizeSensor(): void {
    const nodes = Object.keys(this.clusterService.nodes());

    this.clusterSizeSensor.state = nodes.length;
    this.clusterSizeSensor.attributes.nodes = nodes;
  }

  /**
   * Updates the cluster leader sensor based on the currently elected leader.
   */
  updateClusterLeaderSensor(): void {
    this.clusterLeaderSensor.state = this.clusterService.leader()?.id || 'none';
    this.clusterLeaderSensor.attributes.quorumReached = this.clusterService.quorumReached();
  }

  /**
   * Creates and registers a new cluster size sensor.
   *
   * @returns Registered sensor
   */
  protected createClusterSizeSensor(): Sensor {
    const instanceName = this.configService.get('global').instanceName;
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:server',
          unitOfMeasurement: 'instances',
        },
      },
    ];
    const clusterSizeSensor = this.entitiesService.add(
      new Sensor('status-cluster-size', `Cluster Size`),
      customizations
    );

    return clusterSizeSensor as Sensor;
  }

  /**
   * Creates and registers a new cluster leader sensor.
   *
   * @returns Registered sensor
   */
  protected createClusterLeaderSensor(): Sensor {
    const instanceName = this.configService.get('global').instanceName;
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:account-group',
        },
      },
    ];
    const clusterLeaderSensor = this.entitiesService.add(
      new Sensor('status-cluster-leader', `Cluster Leader`),
      customizations
    );

    return clusterLeaderSensor as Sensor;
  }
}
