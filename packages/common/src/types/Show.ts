import Fixture from "./Fixture";

export default interface Show {
  name?: string;
  path: string;

  universes: { [num: number]: Universe };

  grandMaster?: number;
}

export function defaultShow(name?: string): Partial<Show> {
  return {
    name,
    universes: {},
    grandMaster: 255,
  };
}

export interface Universe {
  fixtures: { [id: string]: Fixture };
  outputs?: Output[];
}

export interface Output {
  name: string;
  args: unknown;
}
