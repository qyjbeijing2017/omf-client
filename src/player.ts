import { Socket, io } from "socket.io-client";
import { Singleton } from "./decorator/singleton";
import { OMFAction } from "./action";
import { IPlayer } from "./player.instance";

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
        const req = await fetch(`${this.entryPoint}/player`, {
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
        const req = await fetch(`${this.entryPoint}/player/token`, {
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

    private _socket: Socket | null = null;
    get socket() {
        if (!this._socket) {
            throw new Error('Socket not connected');
        }
        return this._socket!;
    }
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

    async startLink() {
        const respUser = fetch(`${this.entryPoint}/player`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
        })
        const jsonUser: IPlayer = await respUser.then(resp => resp.json());
        this._player = jsonUser;
        await new Promise<void>((resolve, reject) => {
            this._socket = io(`${this.wsEntryPoint}/player`, {
                extraHeaders: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            this._socket.on('disconnect', () => {
                console.log('disconnected');
                this._player = null;
                this._socket = null;
                this.onDisconnect.emit();
            });

            this._socket!.on('connect', () => {
                console.log('connected');
                resolve();
            });
            this._socket!.on('error', (err: Error) => {
                reject(err);
            });
        });
        return this._player;
    }

    async disconnect() {
        if (this._socket) {
            this._socket.disconnect();
        }
    }

    constructor() {
    }
}