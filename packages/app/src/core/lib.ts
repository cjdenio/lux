import { LuxOutput } from "./outputs";
import { Show, definitions, Fixture, FixtureWithDefinition } from "@lux/common";

import { EventEmitter } from "stream";
import { writeFile, readFile } from "fs/promises";
import { encode, decode } from "@msgpack/msgpack";

export default class Lux extends EventEmitter {
  show?: Show;

  outputs: { [key: string]: LuxOutput } = {};

  // Cache of DMX output
  dmxOutput: { [universe: number]: number[] } = {};
  universeUpdateQueue: { [universe: string]: boolean } = {};

  timeout: NodeJS.Timeout | undefined;

  public async open(path: string): Promise<Show> {
    if (this.show !== undefined) this.close();

    const rawShow = await readFile(path);

    const show = <Show>{
      ...(decode(rawShow) as Partial<Show>),
      path: path,
    };

    this.show = show;

    await this.update();

    this.timeout = setInterval(() => this.update(), 20);

    return show;
  }

  public close(): void {
    if (this.timeout !== undefined) {
      clearInterval(this.timeout);
      this.timeout = undefined;
    }

    if (this.show === undefined) return;

    this.show = undefined;
    this.dmxOutput = {};
    this.universeUpdateQueue = {};

    console.log("Closed project");
  }

  /**
   * Saves the loaded project
   */
  public async save(): Promise<void> {
    if (this.show !== undefined) {
      console.log("saving show");

      await writeFile(this.show.path, encode(this.show));
    }
  }

  /**
   * Called every ~20ms
   */
  private async update() {
    if (this.show === undefined) return;

    // Iterate over universes
    for (const universeIndex in this.show.universes) {
      const universe = this.show.universes[universeIndex];

      // Store the universe's DMX output
      let channels: number[] = [];

      const inUpdateQueue = !!this.universeUpdateQueue[universeIndex];

      // Check if universe needs to be updated
      if (!this.dmxOutput[universeIndex] || inUpdateQueue) {
        console.log(`Updating universe: ${universeIndex}`);

        if (inUpdateQueue) {
          delete this.universeUpdateQueue[universeIndex];
        }

        channels = new Array(512).fill(0);

        // Iterate over fixtures in universe
        for (const fixtureIndex in universe.fixtures) {
          const fixture = universe.fixtures[fixtureIndex];

          const output = this.computeFixtureOutput(fixture);

          output.forEach((value, index) => {
            channels[index + (fixture.startChannel - 1)] = value;
          });
        }
      } else {
        channels = this.dmxOutput[universeIndex];
      }

      // Write the universe to all of the configured outputs
      if (universe.outputs !== undefined) {
        for (const { name, args } of universe.outputs) {
          this.outputs[name]
            .set(channels, parseInt(universeIndex), args)
            .catch((err) => {
              console.error(err);
            });
        }
      }

      this.dmxOutput[universeIndex] = channels;
      this.emit("output-update", this.dmxOutput);
    }
  }

  /**
   * Compute a fixture's DMX output
   */
  private computeFixtureOutput(fixture: Fixture): number[] {
    const definition =
      definitions[fixture.definitionId.definition].configurations[
        fixture.definitionId.configuration
      ];

    const output: number[] = [];

    for (const property in definition.channels) {
      const channel = definition.channels[property];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let value = fixture.properties[property];

      if (value === undefined) {
        switch (property) {
          case "red":
          case "green":
          case "blue":
            value = 255;
            break;

          default:
            value = 0;
            break;
        }
      }

      if (definition.channels["intensity"] === undefined) {
        value = value * ((fixture.properties.intensity ?? 0) / 255);
      }

      if (this.show?.grandMaster !== undefined) {
        value = value * (this.show.grandMaster / 255);
      }

      output[channel] = value;
    }

    if (definition.static) {
      for (const channel in definition.static) {
        const value = definition.static[channel];

        output[channel] = value;
      }
    }

    return output;
  }

  public async attachOutput(name: string, output: LuxOutput): Promise<void> {
    this.outputs[name] = output;
    await output.init();
  }

  public setGrandMaster(value: number): void {
    if (this.show === undefined) return;

    this.show.grandMaster = value;
    this.emit("grand-master-update", this.show.grandMaster);
  }

  public fixtures(): FixtureWithDefinition[] {
    if (this.show === undefined) return [];

    const fixtures: FixtureWithDefinition[] = [];

    for (const universeIndex in this.show.universes) {
      const universe = this.show.universes[universeIndex];

      for (const fixtureIndex in universe.fixtures) {
        const fixture = universe.fixtures[fixtureIndex];

        fixtures.push({
          ...fixture,
          definition: definitions[fixture.definitionId.definition],
        });
      }
    }

    fixtures.sort((a, b) => a.startChannel - b.startChannel);

    return fixtures;
  }

  /**
   * Returns
   */
  public fixturesByUniverse(): {
    [universe: string]: FixtureWithDefinition[];
  } {
    if (this.show === undefined) return {};

    const universes: { [universe: string]: FixtureWithDefinition[] } = {};

    for (const universeIndex in this.show.universes) {
      const universe = this.show.universes[universeIndex];

      universes[universeIndex] = Object.values(universe.fixtures).map((f) => ({
        ...f,
        definition: definitions[f.definitionId.definition],
      }));

      universes[universeIndex].sort((a, b) => a.startChannel - b.startChannel);
    }

    return universes;
  }

  public updateAllUniverses(): void {
    if (this.show === undefined) return;

    for (const universe in this.show.universes) {
      this.universeUpdateQueue[universe] = true;
    }
  }
}
