import { LuxOutput } from "./outputs";
import { Show, definitions, _ } from "@lux/common";

import { EventEmitter } from "stream";
import { writeFile, readFile } from "fs/promises";
import { encode, decode } from "@msgpack/msgpack";

export default class Lux extends EventEmitter {
  show?: Show;

  outputs: { [key: string]: LuxOutput } = {};

  // Cache of DMX output
  dmxOutput: { [universe: number]: number[] } = {};

  public async open(path: string): Promise<Show> {
    if (this.show !== undefined) this.close();

    const rawShow = await readFile(path);

    const show = <Show>{
      ...(decode(rawShow) as Partial<Show>),
      path: path,
    };

    this.show = show;

    await this.update();

    return show;
  }

  public close() {
    if (this.show === undefined) return;

    this.show = undefined;
    this.dmxOutput = {};

    console.log("Closed project");
  }

  public async save() {
    if (this.show !== undefined) {
      await writeFile(this.show.path, encode(this.show));
    }
  }

  public async update() {
    if (this.show === undefined) return;

    // Iterate over universes
    Object.entries(this.show.universes).forEach(
      async ([universeIndex, universe]) => {
        const channels: { [key: number]: number } = {};

        // Iterate over fixtures in universe
        Object.values(universe.fixtures).forEach((fixture) => {
          const definition = definitions[fixture.definitionId];
          if (definition === undefined) {
            throw new Error(
              `Definition not found for fixture: ${fixture.name}`
            );
          }

          let intensityFactor = _(this.show!.grandMaster, 255) / 255;

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

        const dmxOutput = new Array(512).fill(0);

        Object.entries(channels).forEach(([key, value]) => {
          dmxOutput[parseInt(key) - 1] = value;
        });

        this.dmxOutput[parseInt(universeIndex)] = dmxOutput;
        this.emit("output-update", parseInt(universeIndex), dmxOutput);

        try {
          if (universe.outputs) {
            for (const output of universe.outputs) {
              this.outputs[output.name] &&
                this.outputs[output.name].set(dmxOutput, output.args);
            }
          }
        } catch (error) {
          console.log("error updating output");
          console.log(error);
        }
      }
    );
  }

  public async attachOutput(name: string, output: LuxOutput) {
    this.outputs[name] = output;
    await output.init();
  }

  public setGrandMaster(value: number) {
    if (this.show === undefined) return;

    this.show.grandMaster = value;
    this.emit("grand-master-update", this.show.grandMaster);
  }
}
