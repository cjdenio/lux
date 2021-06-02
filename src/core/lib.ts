import definitions from "./definitions";
import { LuxOutput } from "./outputs";
import Fixture from "./types/Fixture";

export default class Lux {
  fixtures: { [id: string]: Fixture } = {};
  output: LuxOutput;

  grandMaster: number = 255;

  public async update() {
    if (!this.output) return;

    const channels: { [key: number]: number } = {};

    Object.values(this.fixtures).forEach((fixture) => {
      const definition = definitions[fixture.definitionId];
      if (definition === undefined) {
        throw new Error(`Definition not found for fixture: ${fixture.name}`);
      }

      Object.entries(fixture.properties).forEach(([property, value]) => {
        let intensityFactor = 1;

        if (
          (property == "red" || property == "green" || property == "blue") &&
          !definition.channels["intensity"] &&
          fixture.properties["intensity"]
        ) {
          intensityFactor = fixture.properties["intensity"] / 255;
        }

        const channel = definition.channels[property];
        if (channel === undefined) {
          if (property == "intensity") {
            return;
          }

          throw new Error(
            `Property "${property}" not valid for fixture definition: ${definition.name}`
          );
        }

        intensityFactor = (intensityFactor * this.grandMaster) / 255;

        channels[channel + fixture.startChannel] = value * intensityFactor;
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

  public setGrandMaster(value: number) {
    this.grandMaster = value;
  }
}
