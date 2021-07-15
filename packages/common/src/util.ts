import { Fixture, FixtureWithDefinition } from ".";

/**
 * Returns the provided value, or the provided default if the value is undefined
 */
export function _<T>(value: T | undefined, defaultValue: T): T {
  if (value !== undefined) {
    return value;
  }

  return defaultValue;
}

export function fixtureEndChannel(f: FixtureWithDefinition): number {
  const channels = [
    ...Object.values(f.definition.channels),
    ...Object.keys(f.definition.static || {}).map(parseInt),
  ];

  return (
    channels.reduce((acc, curr) => (curr > acc ? curr : acc), 0) +
    f.startChannel
  );
}
