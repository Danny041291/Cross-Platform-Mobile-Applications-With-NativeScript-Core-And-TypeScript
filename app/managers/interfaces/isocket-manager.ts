import { LiteEvent } from "~/infrastructure/lite-event";

export type SocketFunction = (args: any) => void

export interface ISocketManager {

    onConnect : LiteEvent<any>;
    onReconnect : LiteEvent<any>;
    onDisconnect : LiteEvent<any>;
    onMessage : LiteEvent<any>;
    onError : LiteEvent<any>;

    isConnected : boolean;

    connect(url: string): void;

    disconnect(): void;

    sendMessage(to: string, content: string): void;

}