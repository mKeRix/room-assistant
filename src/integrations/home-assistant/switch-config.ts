import { EntityConfig } from './entity-config';

export class SwitchConfig extends EntityConfig {
  readonly payloadOn = 'on';
  readonly payloadOff = 'off';
  readonly stateOn = 'true';
  readonly stateOff = 'false';
  icon?: string;
  commandTopic: string;
  commandStore: { [key in 'on' | 'off']: () => undefined };

  constructor(
    id: string,
    name: string,
    onCallback?: () => undefined,
    offCallback?: () => undefined
  ) {
    super('switch', id, name);
    this.commandTopic = `room-assistant/${this.component}/${id}/command`;
    this.commandStore = {
      on: onCallback,
      off: offCallback,
    };
  }
}
