export interface LuxOutput {
  fullName: string;

  init(): Promise<void>;
  close(): Promise<void>;
  set(data: number[], universe: number, args?: unknown): Promise<void>;
}

export { default as ArtnetOutput } from "./artnet";
