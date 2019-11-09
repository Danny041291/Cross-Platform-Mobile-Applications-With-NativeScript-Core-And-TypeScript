export type SocketFunction = (args: any) => void

export interface ISocketManager {

    connected : boolean;

    connect(onConnect: SocketFunction, onReconnect: SocketFunction, onDisconnect: SocketFunction, onMessage: SocketFunction, onError: SocketFunction): void;

    disconnect(): void;

    sendMessage(to: string, content: string): void;

}