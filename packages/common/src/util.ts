import { FixtureWithDefinition } from ".";
import { FixtureDefinition } from "./definitions";

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
