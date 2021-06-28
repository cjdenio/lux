export interface FixtureDefinition {
  name: string;
  category?: string;
  channels: { [property: string]: number };
  static?: { [channel: number]: number };
}

export interface FixtureDefinitionWithId extends FixtureDefinition {
  id: string;
}

export const categories = ["Generic"];

const definitions: { [key: string]: FixtureDefinition } = {
  generic_dimmer: {
    name: "Generic dimmer",
    category: "Generic",
    channels: {
      intensity: 0,
    },
  },
  generic_rgb: {
    name: "Generic RGB",
    category: "Generic",
    channels: {
      red: 0,
      green: 1,
      blue: 2,
    },
  },
  "cf-805": {
    name: "CF-805",
    channels: {
      red: 0,
      green: 1,
      blue: 2,
    },
    static: {
      3: 255,
    },
  },
};

export default definitions;
