import { EntityConfig } from '../integrations/home-assistant/entity-config';

export class EntityOptions {
  homeAssistant?: Partial<EntityConfig> = {};
}
