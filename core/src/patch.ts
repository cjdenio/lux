import yaml from "js-yaml";
import fs from "fs";

export interface FixtureDefinition {
  id: number;
  name: number;
  channels: { [key: number]: string };
}

export interface Fixture {
  id: number;
  fixture: number;
  startChannel: number;
}

export function loadPatch(
  file: string
): { fixtureDefinitions: FixtureDefinition[]; fixtures: Fixture[] } {
  const { fixtureDefinitions, patch } = yaml.load(
    fs.readFileSync(file).toString()
  ) as any;

  return {
    fixtureDefinitions: fixtureDefinitions,
    fixtures: patch,
  };
}
