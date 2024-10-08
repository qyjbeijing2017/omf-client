import { Singleton } from "./decorator/singleton";
import { OMFAction } from "./action";
import { IPlayer } from "./player.instance";
import { Builder, ByteBuffer } from 'flatbuffers';
import { OMFMessage, OMFMessagePayload, Ping } from "./omf/message";


@Singleton()
export class Player {
    private _username: string = localStorage.getItem('username') || '';
    private _token: string = localStorage.getItem('token') || '';
    get username() { return this._username; }
    get token() { return this._token; }
    get authenticated() { return !!this._username && !!this._token; }

    get entryPoint() {
        return `${import.meta.env.VITE_OMF_SSL === 'true' ? 'https' : 'http'}://${import.meta.env.VITE_OMF_HOST}:${import.meta.env.VITE_OMF_PORT}`;
    }

    get wsEntryPoint() {
        return `${import.meta.env.VITE_OMF_SSL === 'true' ? 'wss' : 'ws'}://${import.meta.env.VITE_OMF_HOST}:${import.meta.env.VITE_OMF_PORT}`;
    }

    async signIn(username: string, password: string) {
        const req = await fetch(`${this.entryPoint}/Players/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!req.ok) {
            throw new Error(req.statusText)
        }
        const json = await req.json();

        this._username = username;
        this._token = json.token;
        localStorage.setItem('username', this._username);
        localStorage.setItem('token', this._token);
    }

    async signOut() {
        this._username = '';
        this._token = '';
        localStorage.removeItem('username');
        localStorage.removeItem('token');
    }

    async refreshToken() {
        const req = await fetch(`${this.entryPoint}/players/token`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        if (!req.ok) {
            this._token = '';
            localStorage.removeItem('token');
            throw new Error(req.statusText)
        }
        const json = await req.json();
        this._token = json.token;
    }

    private _socket: WebSocket | null = null;
    readonly onDisconnect = new OMFAction<void>();
    private _player: IPlayer | null = null;
    get player() {
        if (!this._player) {
            throw new Error('Player not connected');
        }
        return this._player;
    }

    get online() {
        return !!this._socket;
    }

    readonly onMessage = new OMFAction<OMFMessage>();

    async startLink() {
        await new Promise<void>((resolve, reject) => {
            this._socket = new WebSocket(this.wsEntryPoint + `/Players/socket?token=${this.token}`);
            const onOpen = () => {
                this._socket?.removeEventListener('open', onOpen);
                this._socket?.removeEventListener('error', onError);
                this._player = {
                    playerId: '1',
                    username: 'test',
                    createdAt: '2021-09-01',
                    auX: 0,
                    auY: 0,
                    auZ: 0,
                    x: 0,
                    y: 0,
                    z: 0,
                    locatedAt: 'Earth',
                };
                this._socket?.addEventListener('message', (event) => {
                    (event.data as Blob).arrayBuffer().then((buffer) => {
                        const byte = new ByteBuffer(new Uint8Array(buffer));
                        const message = OMFMessage.getRootAsOMFMessage(byte);
                        this.onMessage.invoke(message);
                    });
                });
                resolve();
            }
            const onError = (event: Event) => {
                this._socket?.removeEventListener('open', onOpen);
                this._socket?.removeEventListener('error', onError);
                this._socket = null;
                console.error('Socket error', event);
                reject(event);
            }
            this._socket.addEventListener('open', onOpen);
            this._socket.addEventListener('error', onError);
        });
        return this._player;
    }

    ping() {
        let builder = new Builder();
        Ping.startPing(builder);
        let ping = Ping.endPing(builder);
        OMFMessage.startOMFMessage(builder);
        OMFMessage.addPayloadType(builder, OMFMessagePayload.Ping);
        OMFMessage.addPayload(builder, ping);
        const timestamp = Date.now();
        OMFMessage.addTimestamp(builder, BigInt(timestamp));
        let message = OMFMessage.endOMFMessage(builder);
        builder.finish(message);
        let buffer = builder.asUint8Array();
        this._socket?.send(buffer);
        return new Promise<number>((resolve) => {
            const handleMessage = (message: OMFMessage) => {
                if (message.payloadType() === OMFMessagePayload.Pong) {
                    this.onMessage.off(handleMessage);
                    const backTimestemp = Number(message.timestamp());
                    console.log('toServer', backTimestemp - timestamp);
                    resolve(Date.now() - timestamp);
                }
            }
            this.onMessage.on(handleMessage);
        });
    }

    async sendSocket(message: string) {
        if (!this._socket) {
            console.error('Socket not connected');
        }
        this._socket?.send(message);
    }

    async disconnect() {
        if (this._socket) {
            this._socket.close();
        }
    }

    constructor() {
    }
}