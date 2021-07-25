export const categories = ["Generic", "Chauvet"];

export interface FixtureDefinition {
  name: string;
  category?: string;
  configurations: { [name: string]: FixtureDefinitionConfiguration };
}

export interface FixtureDefinitionConfiguration {
  channels: { [property: string]: number };
  static?: { [channel: number]: number };
}

export interface FixtureDefinitionWithId extends FixtureDefinition {
  id: string;
}

const definitions: { [key: string]: FixtureDefinition } = {
  generic_dimmer: {
    name: "Generic dimmer",
    category: "Generic",
    configurations: {
      "1 Channel": {
        channels: {
          intensity: 0,
        },
      },
    },
  },
  generic_rgb: {
    name: "Generic RGB",
    category: "Generic",
    configurations: {
      "3 Channels": {
        channels: {
          red: 0,
          green: 1,
          blue: 2,
        },
      },
    },
  },
  chauvet_colordash_par_quad_7: {
    name: "Chauvet COLORdash Par-Quad 7",
    category: "Chauvet",
    configurations: {
      "4 Channels": {
        channels: {
          red: 0,
          green: 1,
          blue: 2,
          amber: 3,
        },
      },
    },
  },
  "cf-805": {
    name: "CF-805",
    configurations: {
      "4 Channels": {
        channels: {
          red: 0,
          green: 1,
          blue: 2,
        },
        static: {
          3: 255,
        },
      },
    },
  },
};

export default definitions;
