import { Type } from '@nestjs/common';

export function resolveClasses(
  ids: string[],
  mapping: { [key: string]: Type<any> }
): Array<Type<any>> {
  return ids
    .filter(value => mapping.hasOwnProperty(value))
    .map(value => {
      return mapping[value];
    });
}
