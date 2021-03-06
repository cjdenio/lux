import { FixtureDefinition } from "../definitions";
import { PropertyMap } from "./Property";

export default interface Fixture {
  id: number;
  name: string;
  universe: number;
  definitionId: {
    definition: string;
    configuration: string;
  };
  startChannel: number;
  properties: PropertyMap;
}

export interface FixtureWithDefinition extends Fixture {
  definition: FixtureDefinition;
}
