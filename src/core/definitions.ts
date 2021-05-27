import { PropertyMap } from "./types/Property";

export interface FixtureDefinition {
  name: string;
  channels: { [property: string]: number };
}

const definitions: { [key: string]: FixtureDefinition } = {
  generic_dimmer: {
    name: "Generic dimmer",
    channels: {
      intensity: 0,
    },
  },
  generic_rgb: {
    name: "Generic RGB",
    channels: {
      red: 0,
      green: 1,
      blue: 2,
    },
  },
};

export default definitions;
