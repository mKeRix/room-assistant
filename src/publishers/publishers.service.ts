import { Inject, Injectable } from '@nestjs/common';
import { Publisher } from './publisher.interface';
import { Entity } from '../entities/entity.entity';
import { PUBLISHER_SERVICES } from './publishers.constants';
import { ClusterService } from '../cluster/cluster.service';
import { EntityOptions } from './entity-options.entity';

@Injectable()
export class PublishersService {
  constructor(
    @Inject(PUBLISHER_SERVICES) private publishers: Publisher[],
    private readonly clusterService: ClusterService
  ) {}

  publishNewEntity(entity: Entity, publisherOptions?: EntityOptions) {
    this.publishers.map(publisher =>
      publisher.handleNewEntity(entity, publisherOptions)
    );
  }

  publishNewState(
    id: string,
    state: boolean | string | number,
    distributed: boolean = false
  ) {
    if (distributed && !this.clusterService.isLeader()) {
      return;
    }

    this.publishers.map(publisher =>
      publisher.handleNewState(id, state, distributed)
    );
  }

  publishNewAttributes(
    entityId: string,
    attributes: { [key: string]: any },
    distributed: boolean = false
  ) {
    if (distributed && !this.clusterService.isLeader()) {
      return;
    }

    this.publishers.map(publisher =>
      publisher.handleNewAttributes(entityId, attributes, distributed)
    );
  }
}
