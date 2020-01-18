import { Entity } from './entity.entity';
import { EntityOptions } from './entity-options.entity';
import { StrictEventEmitter } from 'nest-emitter';
import EventEmitter = NodeJS.EventEmitter;

interface EntitiesEvents {
  newEntity: (entity: Entity, publisherOptions?: EntityOptions) => void;

  stateUpdate: (
    id: string,
    state: boolean | string | number,
    distributed?: boolean
  ) => void;

  attributesUpdate: (
    entityId: string,
    attributes: { [key: string]: any },
    distributed?: boolean
  ) => void;
}

export type EntitiesEventEmitter = StrictEventEmitter<
  EventEmitter,
  EntitiesEvents
>;
