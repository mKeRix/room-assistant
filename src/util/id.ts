import slugify from 'slugify';

/**
 * Creates an ID from an input string.
 *
 * @param input - String to use for generating the ID
 * @returns Proper ID
 */
export function makeId(input: string): string {
  return slugify(input, {
    lower: true
  }).replace(/[_:]/g, '-');
}
