import Fixture from "./Fixture";

export default interface Show {
  name?: string;
  path: string;

  nextId: number;

  universes: { [num: number]: Universe };

  grandMaster?: number;

  lastRoute?: string;
}

export function defaultShow(name?: string): Partial<Show> {
  return {
    name,
    universes: {},
    grandMaster: 255,
    nextId: 1,
  };
}

export interface Universe {
  fixtures: { [id: string]: Fixture };
  outputs?: Output[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Output<T = any> {
  name: string;
  id: number;
  args: T;
}
