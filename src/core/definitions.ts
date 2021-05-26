import Property, { PropertyMap } from "./types/Property";

export interface FixtureDefinition {
  name: string;
  channels: { [key: string]: number };
}

const definitions: { [key: string]: FixtureDefinition } = {
  generic_dimmer: {
    name: "Generic dimmer",
    channels: {
      i: 0,
    },
  },
  generic_rgb: {
    name: "Generic RGB",
    channels: {
      r: 0,
      g: 1,
      b: 2,
    },
  },
};

export default definitions;
