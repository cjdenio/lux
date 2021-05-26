import dgram, { Socket } from "dgram";
import { LuxOutput } from ".";

export default class ArtnetOutput implements LuxOutput {
  private socket: Socket;
  addr: string;

  constructor(addr: string) {
    this.addr = addr;
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = dgram.createSocket("udp4");
      this.socket.bind(undefined, "192.168.1.6");
      this.socket.on("listening", () => {
        this.socket.setBroadcast(true);
        resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.close(() => resolve());
    });
  }

  set(data: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const packet = Buffer.alloc(18 + data.length);

      packet.write("Art-Net");
      packet.writeUInt8(0x00, 7);

      packet.writeUInt16LE(0x5000, 8);

      packet.writeUInt16BE(14, 10);

      packet.writeUInt8(0x01, 12);

      packet.writeUInt8(0x00, 13);
      packet.writeUInt8(0x00, 14);
      packet.writeUInt8(0x00, 15);

      packet.writeUInt16BE(data.length, 16);

      Buffer.from(data).copy(packet, 18);

      this.socket.send(packet, 0x1936, this.addr, () => resolve());
    });
  }
}
