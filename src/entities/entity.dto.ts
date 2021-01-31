import { ApiProperty } from '@nestjs/swagger';

export abstract class Entity {
  constructor(
    id: string,
    name: string,
    distributed = false,
    stateLocked = true
  ) {
    this.id = id;
    this.name = name;
    this.distributed = distributed;
    this.stateLocked = stateLocked;
  }

  readonly id: string;
  name: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
  })
  state: string | number | boolean | Buffer;

  @ApiProperty({ type: 'object' })
  attributes: { [key: string]: any } = {};

  readonly distributed: boolean;
  readonly stateLocked: boolean;
}
