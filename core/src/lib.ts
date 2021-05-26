import definitions from "./definitions";
import { LuxOutput } from "./outputs";
import Fixture from "./types/Fixture";

export default class Lux {
  fixtures: { [id: string]: Fixture } = {};
  output: LuxOutput;

  public async update() {
    const channels: { [key: number]: number } = {};

    Object.values(this.fixtures).forEach((fixture) => {
      const definition = definitions[fixture.definitionId];
      if (definition === undefined) {
        throw new Error(`Definition not found for fixture: ${fixture.name}`);
      }

      Object.entries(fixture.properties).forEach(([property, value]) => {
        const channel = definition.channels[property];
        if (channel === undefined) {
          throw new Error(
            `Property "${property}" not valid for fixture definition: ${definition.name}`
          );
        }

        channels[channel + fixture.startChannel] = value;
      });
    });

    const output = new Array(512).fill(0);

    Object.entries(channels).forEach(([key, value]) => {
      output[parseInt(key) - 1] = value;
    });

    await this.output.set(output);
  }

  public async attachOutput(output: LuxOutput) {
    this.output = output;
    await this.output.init();
  }
}
