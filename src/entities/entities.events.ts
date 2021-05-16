import { Entity } from './entity.dto';
import { StrictEventEmitter } from 'nest-emitter';
import EventEmitter = NodeJS.EventEmitter;
import { EntityCustomization } from './entity-customization.interface';

interface EntitiesEvents {
  newEntity: (
    entity: Entity,
    customizations?: Array<EntityCustomization<any>>
  ) => void;

  entityUpdate: (
    entity: Entity,
    diff: Array<PropertyDiff>,
    hasAuthority: boolean
  ) => void;
}

export interface PropertyDiff {
  path: string;
  oldValue: any;
  newValue: any;
}

export type EntitiesEventEmitter = StrictEventEmitter<
  EventEmitter,
  EntitiesEvents
>;
