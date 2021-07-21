import { BrowserWindow, IpcMain, Menu } from "electron";
import { Lux } from "../core";
import {
  FixtureDefinitionWithId,
  categories,
  definitions,
  Fixture,
} from "@lux/common";
import { definitionChannelCount } from "@lux/common";

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
}
