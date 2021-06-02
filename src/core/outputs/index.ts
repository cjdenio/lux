export interface LuxOutput {
  init(): Promise<void>;
  close(): Promise<void>;
  set(data: number[]): Promise<void>;
}

export { default as ArtnetOutput } from "./artnet";
