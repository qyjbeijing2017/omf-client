export enum OMFMessageType {
  // toServer
  PING = 0,

  // toClient
  PONG = 1,
}

export interface OMFMessage {
    type: OMFMessageType;
    payload: any;
}
