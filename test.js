const msgpack = require("@msgpack/msgpack");
const fs = require("fs");

const show = msgpack.encode({
  fixtures: [
    {
      id: 1,
      name: "test",
      startChannel: 1,
      definitionId: "generic_dimmer",
      properties: {},
    },
    {
      id: 2,
      name: "test",
      startChannel: 2,
      definitionId: "generic_dimmer",
      properties: {},
    },
    {
      id: 3,
      name: "test",
      startChannel: 3,
      definitionId: "generic_dimmer",
      properties: {},
    },
    {
      id: 4,
      name: "test",
      startChannel: 4,
      definitionId: "generic_dimmer",
      properties: {},
    },
    {
      id: 5,
      name: "test",
      startChannel: 5,
      definitionId: "generic_dimmer",
      properties: {},
    },
    {
      id: 6,
      name: "test",
      startChannel: 6,
      definitionId: "generic_rgb",
      properties: {
        red: 0,
        green: 255,
        blue: 255,
      },
    },
    {
      id: 7,
      name: "test",
      startChannel: 10,
      definitionId: "generic_rgb",
      properties: {},
    },
    {
      id: 8,
      name: "test",
      startChannel: 14,
      definitionId: "generic_rgb",
      properties: {
        red: 0,
        green: 255,
        blue: 255,
      },
    },
    {
      id: 9,
      name: "test",
      startChannel: 18,
      definitionId: "generic_rgb",
      properties: {},
    },
    {
      id: 10,
      name: "test",
      startChannel: 22,
      definitionId: "generic_rgb",
      properties: {
        red: 0,
        green: 255,
        blue: 255,
      },
    },
    {
      id: 11,
      name: "test",
      startChannel: 26,
      definitionId: "cf-805",
      properties: {},
    },
    {
      id: 12,
      name: "test",
      startChannel: 30,
      definitionId: "cf-805",
      properties: {},
    },
  ].reduce((accumulator, fixture) => {
    accumulator[fixture.id] = fixture;
    return accumulator;
  }, {}),
});

fs.writeFileSync("show.lux", show);

// console.log(msgpack.decode(fs.readFileSync("show.lux")));
