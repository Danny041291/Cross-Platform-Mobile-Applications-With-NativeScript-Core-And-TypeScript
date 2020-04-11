import { LiteEvent } from "~/infrastructure/lite-event";
import { SocketUser } from "~/models/socket-user";

export interface ISocketManager {

    onConnect : LiteEvent<any>;
    onReconnect : LiteEvent<any>;
    onDisconnect : LiteEvent<any>;
    onMessage : LiteEvent<any>;
    onError : LiteEvent<any>;

    onUsersList: LiteEvent<SocketUser[]>;
    onUserConnected: LiteEvent<SocketUser>;
    onUserDisconnected: LiteEvent<SocketUser>;

    isSocketConnected : boolean;

    connect(url: string): void;

    disconnect(): void;

    sendMessage(socketId: string, message: any): void;

}