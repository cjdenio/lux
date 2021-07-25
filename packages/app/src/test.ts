import { decode, encode } from "@msgpack/msgpack";
import { writeFileSync, readFileSync } from "fs";
import { Show } from "@lux/common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const show: Partial<Show> = {
  name: "Test Show",
  universes: {
    1: {
      fixtures: {},
      // outputs: [{ name: "artnet", args: {} }],
    },
  },
};

const stuff = readFileSync("show.lux");

const more = decode(stuff) as Show;

more.universes[1].outputs = [
  { name: "artnet", id: more.nextId, args: { subnet: 0, universe: 0 } },
  { name: "artnet", id: more.nextId + 1, args: { subnet: 0, universe: 1 } },
];

more.nextId += 2;

writeFileSync("show.lux", encode(more));

console.log(more);

// console.log(msgpack.decode(fs.readFileSync("show.lux")));
