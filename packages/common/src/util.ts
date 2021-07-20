import { FixtureWithDefinition } from ".";
import { FixtureDefinition } from "./definitions";

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
  return definitionChannelCount(f.definition) + (f.startChannel - 1);
}

export function definitionChannelCount(definition: FixtureDefinition): number {
  const channels = [
    ...Object.values(definition.channels),
    ...Object.keys(definition.static || {}).map(parseInt),
  ];

  return channels.reduce((acc, curr) => (curr > acc ? curr : acc), 0) + 1;
}
