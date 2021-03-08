/**
 * Generates a random integer between min and max (inclusive)
 *
 * @param  {number} min
 * @param  {number} max
 * @returns randomly generated integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
