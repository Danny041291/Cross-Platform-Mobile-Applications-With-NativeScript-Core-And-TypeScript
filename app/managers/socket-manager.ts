import { SocketIO } from "nativescript-socket.io";
import { ISocketManager } from "./interfaces/isocket-manager";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { LoginService } from "~/services/login-service";
import { LiteEvent } from "~/infrastructure/lite-event";

export class SocketManager implements ISocketManager {

    @Injectable
    loginService: LoginService;

    public readonly onConnect = new LiteEvent<any>();
    public readonly onReconnect = new LiteEvent<any>();
    public readonly onDisconnect = new LiteEvent<any>();
    public readonly onMessage = new LiteEvent<any>();
    public readonly onError = new LiteEvent<any>();

    private _socketIO: SocketIO;

    get isConnected(): boolean {
        return this._socketIO != null && this._socketIO.connected;
    }

    public connect(url: string): void {
        this._socketIO = new SocketIO(url, { query: { auth_token: this.loginService.user.token } });
        this._socketIO.on('connect', (payload) => this.onConnect.trigger(payload));
        this._socketIO.on('reconnect', (payload) => this.onReconnect.trigger(payload));
        this._socketIO.on('disconnect', (payload) => this.onDisconnect.trigger(payload));
        this._socketIO.on('message', (payload) => this.onMessage.trigger(payload));
        this._socketIO.on('error', (payload) => this.onError.trigger(payload));
        this._socketIO.connect();
    }

    public disconnect(): void {
        this._socketIO.disconnect();
    }

    public sendMessage(to: string, content: string): void {
        if (this._socketIO == null) return;
        this._socketIO.emit('message', { username: to, content: content });
    }

}