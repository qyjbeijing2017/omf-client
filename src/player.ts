import { Socket, io } from "socket.io-client";
import { Singleton } from "./decorator/singleton";

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
        const req = await fetch(`${this.entryPoint}/user`, {
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
    private _socket: Socket | null = null;

    get socket() {
        if (!this._socket) {
            throw new Error('Socket not connected');
        }
        return this._socket!;
    }

    async connect() {
        this._socket = io(`${this.wsEntryPoint}/stars`, {
            extraHeaders: {
                Authorization: `Bearer ${this._token}`,
            },
        });
        this._socket.on('connect', () => {
            console.log('connected');
        });
        this._socket.on('disconnect', () => {
            console.log('disconnected');
        });
        
    }
}