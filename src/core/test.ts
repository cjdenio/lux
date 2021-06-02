import Lux from "./lib";
import ArtnetOutput from "./outputs/artnet";
import { promises as fs } from "fs";
import Fixture from "./types/Fixture";

(async () => {
  const lux = new Lux();
  await lux.attachOutput(new ArtnetOutput("192.168.1.255"));

  const fixtures = await fs.readFile("fixtures.json");

  const test = JSON.parse(fixtures.toString()).reduce(
    (acc: { [id: string]: Fixture }, curr: Fixture) => {
      return { ...acc, [curr.id]: curr };
    },
    {}
  );

  lux.fixtures = test;

  for (let i = 2; i <= 4; i++) {
    lux.fixtures[i].properties.intensity = 100;
  }

  lux.fixtures[1].properties.intensity = 50;
  lux.fixtures[5].properties.intensity = 50;

  lux.fixtures[6].properties = {
    red: 255,
    blue: 255,
    intensity: 100,
  };
  lux.fixtures[7].properties = {
    blue: 200,
  };
  lux.fixtures[8].properties = {
    blue: 200,
  };
  lux.fixtures[9].properties = {
    blue: 200,
  };
  lux.fixtures[10].properties = {
    red: 100,
    blue: 100,
  };

  await lux.update();

  await lux.output.close();
})();
