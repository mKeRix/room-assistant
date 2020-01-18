import { Entity } from '../entities/entity.entity';
import { EntityOptions } from './entity-options.entity';

export interface Publisher {
  handleNewEntity(entity: Entity, entityOptions?: EntityOptions): void;
  handleNewState(
    id: string,
    state: number | string | boolean,
    distributed?: boolean
  );
  handleNewAttributes(
    id: string,
    attributes: { [key: string]: any },
    distributed?: boolean
  );
}
