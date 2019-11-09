import { SocketIO } from "nativescript-socket.io";
import { ISocketManager, SocketFunction } from "./interfaces/isocket-manager";
import { environment } from "~/environments/environment";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { LoginService } from "~/services/login-service";

export class SocketManager implements ISocketManager {

    @Injectable
    loginService: LoginService;

    private _socketIO: SocketIO;

    get connected(): boolean {
        return this._socketIO != null && this._socketIO.connected;
    }

    public connect(onConnect: SocketFunction, onReconnect: SocketFunction, onDisconnect: SocketFunction, onMessage: SocketFunction, onError: SocketFunction): void {
        this._socketIO = new SocketIO(environment.socketUrl, { query: { token: this.loginService.user.token } });
        this._socketIO.on('connect', onConnect);
        this._socketIO.on('reconnect', onReconnect);
        this._socketIO.on('disconnect', onDisconnect);
        this._socketIO.on('message', onMessage);
        this._socketIO.on('error', onError);
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