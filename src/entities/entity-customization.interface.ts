import { Type } from '@nestjs/common';

export interface EntityCustomization<T> {
  for: Type<T>;
  overrides: Partial<T>;
}
