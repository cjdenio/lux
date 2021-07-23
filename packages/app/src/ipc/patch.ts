import { BrowserWindow, IpcMain, Menu } from "electron";
import { Lux } from "../core";
import {
  FixtureDefinitionWithId,
  categories,
  definitions,
  Fixture,
  Output,
  definitionChannelCount,
} from "@lux/common";

export default function initPatchIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
): void {
  // Map used here to preserve insertion order
  ipc.handle("definitions", (): Map<string, FixtureDefinitionWithId[]> => {
    const definitionsWithCategories = new Map<
      string,
      FixtureDefinitionWithId[]
    >();

    categories.forEach((c) => {
      definitionsWithCategories.set(c, []);
      definitionsWithCategories.set("Uncategorized", []);
    });

    Object.entries(definitions).forEach(([id, definition]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      definitionsWithCategories
        .get(definition.category || "Uncategorized")!
        .push({ ...definition, id });
    });

    return definitionsWithCategories;
  });

  ipc.on("patch-fixture", (_e, f: Fixture, num: number, gap: number) => {
    if (lux.show === undefined) return;

    f.properties = {};

    const channelCount =
      definitionChannelCount(definitions[f.definitionId]) + gap;

    for (let i = 0; i < num; i++) {
      const id = lux.show.nextId + i;

      const newFixture = {
        ...f,
        id,
        name: f.name.replace("{}", (i + 1).toString()),
        startChannel: f.startChannel + channelCount * i,
      };

      if (!lux.show?.universes[f.universe]) {
        lux.show.universes[f.universe] = {
          fixtures: {
            [id]: newFixture,
          },
        };
      } else {
        lux.show.universes[f.universe].fixtures[id] = newFixture;
      }
    }

    lux.show.nextId += num;

    mainWindow.webContents.send("fixtures-update", lux.fixtures());
    mainWindow.webContents.send(
      "fixtures-by-universe-update",
      lux.fixturesByUniverse()
    );

    lux.save();
  });

  ipc.on("fixture-patch-context-menu", (_e, id: number) => {
    Menu.buildFromTemplate([
      {
        label: "Delete fixture",
        click: () => {
          if (lux.show === undefined) return;

          for (const universeIndex in lux.show.universes) {
            const universe = lux.show.universes[universeIndex];

            if (universe.fixtures[id] !== undefined) {
              delete universe.fixtures[id];

              lux.universeUpdateQueue[universeIndex] = true;

              mainWindow.webContents.send("fixtures-update", lux.fixtures());
              mainWindow.webContents.send(
                "fixtures-by-universe-update",
                lux.fixturesByUniverse()
              );

              lux.save();
              break;
            }
          }
        },
      },
    ]).popup();
  });

  ipc.on("delete-universe", (_e, universe: number) => {
    if (lux.show === undefined) return;

    delete lux.show.universes[universe];
    delete lux.dmxOutput[universe];

    mainWindow.webContents.send("fixtures-update", lux.fixtures());
    mainWindow.webContents.send(
      "fixtures-by-universe-update",
      lux.fixturesByUniverse()
    );

    lux.save();
  });

  ipc.handle("outputs", async (): Promise<{ [universe: number]: Output[] }> => {
    if (lux.show === undefined) return {};

    const universes: { [universe: number]: Output[] } = {};

    for (const universeIndex in lux.show.universes) {
      const universe = lux.show.universes[universeIndex];

      universes[universeIndex] = universe.outputs || [];
    }

    return universes;
  });

  ipc.handle("delete-output", (_e, universe: number, id: number) => {
    if (lux.show === undefined) return {};

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lux.show.universes[universe].outputs!.splice(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lux.show.universes[universe].outputs!.findIndex((v) => v.id === id),
      1
    );

    lux.save();
  });

  ipc.handle(
    "create-output",
    (_e, universe: number, name: string, args: unknown) => {
      if (lux.show === undefined) return {};

      if (lux.show.universes[universe].outputs === undefined) {
        lux.show.universes[universe].outputs = [
          { id: lux.show.nextId, name, args },
        ];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        lux.show.universes[universe].outputs!.push({
          id: lux.show.nextId,
          name,
          args,
        });
      }

      lux.show.nextId++;

      lux.save();
    }
  );
}
