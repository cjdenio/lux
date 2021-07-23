import dgram, { Socket } from "dgram";
import { LuxOutput } from ".";

export default class ArtnetOutput implements LuxOutput {
  private socket: Socket;
  addr: string;

  constructor(addr: string) {
    this.addr = addr;
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.socket = dgram.createSocket("udp4");
      this.socket.bind(undefined, undefined);
      this.socket.on("listening", () => {
        this.socket.setBroadcast(true);
        resolve();
      });
      this.socket.on("error", (err) => console.log(err));
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.close(() => resolve());
    });
  }

  set(
    data: number[],
    luxUniverse: number,
    { subnet, universe }: { subnet: number; universe: number }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const packet = Buffer.alloc(18 + data.length);

      packet.write("Art-Net");
      packet.writeUInt8(0x00, 7);

      packet.writeUInt16LE(0x5000, 8); // Opcode - ArtDmx

      packet.writeUInt16BE(14, 10); // Protocol version

      packet.writeUInt8(0x00, 12); // Sequence

      packet.writeUInt8(luxUniverse, 13); // Physical
      packet.writeUInt8(universe + (subnet << 4), 14); // Subnet/Universe
      packet.writeUInt8(0x00, 15); // Net

      packet.writeUInt16BE(data.length, 16); // Data length

      Buffer.from(data).copy(packet, 18); // Data

      this.socket.send(packet, 0x1936, this.addr, (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }
}
