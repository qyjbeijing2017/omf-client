// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

export class Ping {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Ping {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsPing(bb:flatbuffers.ByteBuffer, obj?:Ping):Ping {
  return (obj || new Ping()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsPing(bb:flatbuffers.ByteBuffer, obj?:Ping):Ping {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Ping()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static startPing(builder:flatbuffers.Builder) {
  builder.startObject(0);
}

static endPing(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createPing(builder:flatbuffers.Builder):flatbuffers.Offset {
  Ping.startPing(builder);
  return Ping.endPing(builder);
}
}
