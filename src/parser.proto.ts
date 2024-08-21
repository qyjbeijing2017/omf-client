import Emitter from 'component-emitter';

class Encoder {
  /**
   * Encode a packet into a list of strings/buffers
   */
  encode(packet: string) {
    return [JSON.stringify(packet)];
  }
}
class Decoder extends Emitter {
  /**
   * Receive a chunk (string or buffer) and optionally emit a "decoded" event with the reconstructed packet
   */
  add(chunk: string) {
    const packet = JSON.parse(chunk);
    this.emit('decoded', packet);
  }
  destroy() {}
}
export const omfProtoParser = {
  Encoder,
  Decoder,
};
