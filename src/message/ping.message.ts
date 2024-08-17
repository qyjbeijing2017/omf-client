import { omfRandomStr } from "../utils/random-str";
import { OMFMessage, OMFMessageType } from "./message.interface";

export interface OMFPingMessage extends OMFMessage {
    type: OMFMessageType.PING;
    payload: {
        id: string;
        timestamp: number;
    };
}

export interface OMFPongMessage extends OMFMessage {
    type: OMFMessageType.PONG;
    payload: {
        id: string;
        timestamp: number;
    };
}

export function pingMessage(): OMFPingMessage {
    return {
        type: OMFMessageType.PING,
        payload: {
            id: omfRandomStr(4),
            timestamp: Date.now(),
        }
    };
}

export function pongMessage(id: string): OMFPongMessage {
    return {
        type: OMFMessageType.PONG,
        payload: {
            id: id,
            timestamp: Date.now(),
        }
    };
}