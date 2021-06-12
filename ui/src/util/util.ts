// Returns the provided value, or the provided default if the value is undefined
export function _<T>(value: T | undefined, defaultValue: T): T {
  if (value !== undefined) {
    return value;
  }

  return defaultValue;
}
