import slugify from 'slugify';

export function makeId(input: string): string {
  return slugify(input, {
    lower: true
  }).replace(/[_:]/g, '-');
}
