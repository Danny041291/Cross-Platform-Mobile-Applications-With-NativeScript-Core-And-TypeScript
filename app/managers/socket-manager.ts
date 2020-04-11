import { SocketIO } from "nativescript-socket.io";
import { ISocketManager } from "./interfaces/isocket-manager";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { LoginService } from "~/services/login-service";
import { LiteEvent } from "~/infrastructure/lite-event";
import { SocketUser } from "~/models/socket-user";

export class SocketManager implements ISocketManager {

    @Injectable
    loginService: LoginService;

    public readonly onConnect = new LiteEvent<any>();
    public readonly onReconnect = new LiteEvent<any>();
    public readonly onDisconnect = new LiteEvent<any>();
    public readonly onMessage = new LiteEvent<any>();
    public readonly onError = new LiteEvent<any>();

    public readonly onUsersList = new LiteEvent<SocketUser[]>();
    public readonly onUserConnected = new LiteEvent<SocketUser>();
    public readonly onUserDisconnected = new LiteEvent<SocketUser>();

    public users: Array<SocketUser>;

    private _socketIO: SocketIO;

    constructor() {
        this.users = new Array<SocketUser>();
    }

    get isSocketConnected(): boolean {
        return this._socketIO != null && this._socketIO.connected;
    }

    public connect(url: string): void {
        this._socketIO = new SocketIO(url, { query: { auth_token: this.loginService.user.token } });
        this._socketIO.on('connect', (payload) => this.onConnect.trigger(payload));
        this._socketIO.on('reconnect', (payload) => this.onReconnect.trigger(payload));
        this._socketIO.on('disconnect', (payload) => this.onDisconnect.trigger(payload));
        this._socketIO.on('message', (payload) => this.onMessage.trigger(payload));
        this._socketIO.on('error', (payload) => this.onError.trigger(payload));
        this._socketIO.on('users-list', (payload: SocketUser[]) => this.setUsersList(payload));
        this._socketIO.on('user-connected', (payload: SocketUser) => this.addUser(payload));
        this._socketIO.on('user-disconnected', (payload: SocketUser) => this.removeUser(payload));
        this._socketIO.connect();
    }

    public disconnect(): void {
        if (this._socketIO == null) return;
        this._socketIO.disconnect();
    }

    public sendMessage(socketId: string, message: any): void {
        if (this._socketIO == null) return;
        this._socketIO.emit('message', { socketId: socketId, message: message });
    }

    private setUsersList(users: SocketUser[]): void {
        this.users = users;
        this.onUsersList.trigger(this.users);
    }

    private addUser(user: SocketUser): void {
        this.users.push(user);
        this.onUserConnected.trigger(user)
    }

    private removeUser(user: SocketUser): void {
        this.onUserDisconnected.trigger(user);
        var index = this.users.indexOf(user);
        if (index == -1) return;
        this.users.splice(index, 1);
    }

}