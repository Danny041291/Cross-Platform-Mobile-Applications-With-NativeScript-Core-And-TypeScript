import { SocketIO } from "nativescript-socket.io";
import { User } from "~/models/user";
import { ISocketManager, SocketFunction } from "./interfaces/isocket-manager";
import { environment } from "~/environments/environment";
import { Injectable } from "~/infrastructure/injectable-decorator";

export class SocketManager implements ISocketManager {

    @Injectable
    user: User;

    private _socketIO: SocketIO;

    public connect(onConnect: SocketFunction, onReconnect: SocketFunction, onDisconnect: SocketFunction, onMessage: SocketFunction, onError: SocketFunction): void {
        this._socketIO = new SocketIO(environment.socketUrl, { query: { token: this.user.token } });
        this._socketIO.on('connect', onConnect);
        this._socketIO.on('reconnect', onReconnect);
        this._socketIO.on('disconnect', onDisconnect);
        this._socketIO.on('message', onMessage);
        this._socketIO.on('error', onError);
        this._socketIO.connect();
    }

    public sendMessage(to: string, content: string): void {
        if (this._socketIO == null) return;
        this._socketIO.emit('message', { username: to, content: content });
    }

}