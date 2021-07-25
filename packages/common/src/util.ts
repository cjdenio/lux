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
  return (
    definitionChannelCount(f.definition, f.definitionId.configuration) +
    (f.startChannel - 1)
  );
}

export function definitionChannelCount(
  definition: FixtureDefinition,
  configuration: string
): number {
  const channels = [
    ...Object.values(definition.configurations[configuration].channels),
    ...Object.keys(definition.configurations[configuration].static || {}).map(
      parseInt
    ),
  ];

  return channels.reduce((acc, curr) => (curr > acc ? curr : acc), 0) + 1;
}
