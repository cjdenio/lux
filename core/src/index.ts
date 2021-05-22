import { loadPatch } from "./patch";

const { fixtures, fixtureDefinitions } = loadPatch("config.yaml");

const fixtureValues: { [fixture: number]: any } = {
  1: {
    r: 255,
    g: 0,
    b: 0,
  },
  2: {
    r: 0,
    g: 255,
    b: 0,
  },
};

function getChannelValues(): { [channel: number]: number } {
  let values: { [channel: number]: number } = {};

  fixtures.forEach((f) => {
    const fixture = fixtureDefinitions.find((i) => i.id == f.fixture);
    if (!fixture) return;
    if (!fixtureValues[f.id]) return;

    Object.entries(fixture.channels).forEach((c) => {
      const [channel, type] = c;

      values[f.startChannel + parseInt(channel) - 1] =
        fixtureValues[f.id][type];
    });
  });

  return values;
}

console.log(getChannelValues());
