export interface LuxOutput {
  init(): Promise<void>;
  close(): Promise<void>;
  set(data: number[]): Promise<void>;
}
