/**
 * Retrieves an object property in a case insensitive manner.
 * Adapted from https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively.
 *
 * @param object - Object in which to look for the property
 * @param key - Key of the property
 */
export function getPropertyCaseInsensitive<
  T extends Record<string, unknown>,
  K extends keyof T
>(object: T, key: K): T[K] {
  return object[
    Object.keys(object).find(
      (k) => k.toLowerCase() === key.toString().toLowerCase()
    )
  ] as T[K];
}
