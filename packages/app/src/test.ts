import { encode } from "@msgpack/msgpack";
import { writeFileSync } from "fs";
import { Show } from "@lux/common";

const show: Partial<Show> = {
  name: "Test Show",
  universes: {
    1: {
      fixtures: {
        1: {
          id: 1,
          universe: 1,
          name: "test",
          startChannel: 1,
          definitionId: "generic_dimmer",
          properties: {},
        },
        2: {
          id: 2,
          universe: 1,
          name: "test",
          startChannel: 2,
          definitionId: "generic_dimmer",
          properties: {},
        },
        3: {
          id: 3,
          universe: 1,
          name: "test",
          startChannel: 3,
          definitionId: "generic_dimmer",
          properties: {},
        },
        4: {
          id: 4,
          universe: 1,
          name: "test",
          startChannel: 4,
          definitionId: "generic_dimmer",
          properties: {},
        },
        5: {
          id: 5,
          universe: 1,
          name: "test",
          startChannel: 5,
          definitionId: "generic_dimmer",
          properties: {},
        },
        6: {
          id: 6,
          universe: 1,
          name: "test",
          startChannel: 6,
          definitionId: "generic_rgb",
          properties: {},
        },
        7: {
          id: 7,
          universe: 1,
          name: "test",
          startChannel: 10,
          definitionId: "generic_rgb",
          properties: {},
        },
        8: {
          id: 8,
          universe: 1,
          name: "test",
          startChannel: 14,
          definitionId: "generic_rgb",
          properties: {},
        },
        9: {
          id: 9,
          universe: 1,
          name: "test",
          startChannel: 18,
          definitionId: "generic_rgb",
          properties: {},
        },
        10: {
          id: 10,
          universe: 1,
          name: "test",
          startChannel: 22,
          definitionId: "generic_rgb",
          properties: {},
        },
        11: {
          id: 11,
          universe: 1,
          name: "test",
          startChannel: 26,
          definitionId: "cf-805",
          properties: {},
        },
        12: {
          id: 12,
          universe: 1,
          name: "test",
          startChannel: 30,
          definitionId: "cf-805",
          properties: {},
        },
        13: {
          id: 13,
          universe: 1,
          name: "test",
          startChannel: 34,
          definitionId: "cf-805",
          properties: {},
        },
      },
      outputs: [{ name: "artnet", args: {} }],
    },
  },
};

writeFileSync("show.lux", encode(show));

// console.log(msgpack.decode(fs.readFileSync("show.lux")));
