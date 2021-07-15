import definitions from "./definitions";
import { LuxOutput } from "./outputs";
import Show from "./types/Show";

import { EventEmitter } from "stream";
import { writeFile, readFile } from "fs/promises";
import { encode, decode } from "@msgpack/msgpack";

export default class Lux extends EventEmitter {
  show?: Show;

  output: LuxOutput;

  dmxOutput: number[] = new Array(512).fill(0);

  public async open(path: string): Promise<Show> {
    const rawShow = await readFile(path);

    const show = <Show>{
      ...(decode(rawShow) as Partial<Show>),
      path: path,
    };

    this.show = show;

    await this.update();

    return show;
  }

  public async save() {
    if (this.show !== undefined) {
      await writeFile(this.show.path, encode(this.show));
    }
  }

  public async update() {
    if (!this.output) return;
    if (!this.show) return;

    const channels: { [key: number]: number } = {};

    Object.values(this.show.fixtures).forEach((fixture) => {
      const definition = definitions[fixture.definitionId];
      if (definition === undefined) {
        throw new Error(`Definition not found for fixture: ${fixture.name}`);
      }

      let intensityFactor = (this.show!.grandMaster || 255) / 255;

      if (definition.channels["intensity"] === undefined) {
        intensityFactor =
          intensityFactor * ((fixture.properties["intensity"] || 0) / 255);
      }

      // Ensure that colors are 255 if not set
      ["red", "green", "blue"].forEach((color) => {
        if (
          definition.channels[color] !== undefined &&
          // @ts-ignore
          fixture.properties[color] === undefined
        ) {
          channels[fixture.startChannel + definition.channels[color]] =
            255 * intensityFactor;
        }
      });

      Object.entries(fixture.properties).forEach(([property, value]) => {
        const channel = definition.channels[property];
        if (channel === undefined) {
          if (property == "intensity") {
            return;
          }

          throw new Error(
            `Property "${property}" not valid for fixture definition: ${definition.name}`
          );
        }

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

    try {
      await this.output.set(output);
    } catch (error) {
      console.log("error updating output");
      console.log(error);
    }
  }

  public async attachOutput(output: LuxOutput) {
    this.output = output;
    await this.output.init();
  }

  public setGrandMaster(value: number) {
    if (this.show === undefined) return;

    this.show.grandMaster = value;
    this.emit("grand-master-update", this.show.grandMaster);
  }
}
