import definitions from "./definitions";
import { LuxOutput } from "./outputs";
import Fixture from "./types/Fixture";

import { EventEmitter } from "stream";

export default class Lux extends EventEmitter {
  fixtures: { [id: string]: Fixture } = {};
  output: LuxOutput;

  dmxOutput: number[] = new Array(512).fill(0);

  grandMaster: number = 255;

  public async update() {
    if (!this.output) return;

    const channels: { [key: number]: number } = {};

    Object.values(this.fixtures).forEach((fixture) => {
      const definition = definitions[fixture.definitionId];
      if (definition === undefined) {
        throw new Error(`Definition not found for fixture: ${fixture.name}`);
      }

      if (
        definition.channels["red"] !== undefined &&
        fixture.properties.red === undefined
      ) {
        fixture.properties.red = 255;
      }
      if (
        definition.channels["green"] !== undefined &&
        fixture.properties.green === undefined
      ) {
        fixture.properties.green = 255;
      }
      if (
        definition.channels["blue"] !== undefined &&
        fixture.properties.blue === undefined
      ) {
        fixture.properties.blue = 255;
      }

      Object.entries(fixture.properties).forEach(([property, value]) => {
        let intensityFactor = 1;

        if (
          (property == "red" || property == "green" || property == "blue") &&
          !definition.channels["intensity"]
        ) {
          intensityFactor = (fixture.properties["intensity"] || 0) / 255;
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

      if (definition.static) {
        Object.entries(definition.static).forEach(([channel, value]) => {
          channels[parseInt(channel) + fixture.startChannel] = value;
        });
      }
    });

    const output = new Array(512).fill(0);

    Object.entries(channels).forEach(([key, value]) => {
      output[parseInt(key) - 1] = value;
    });

    this.dmxOutput = output;
    this.emit("output-update", output);

    await this.output.set(output);
  }

  public async attachOutput(output: LuxOutput) {
    this.output = output;
    await this.output.init();
  }

  public setGrandMaster(value: number) {
    this.grandMaster = value;
    this.emit("grand-master-update", this.grandMaster);
  }
}
