export type SocketFunction = (args: any) => void

export interface ISocketManager {

    connect(onConnect: SocketFunction, onReconnect: SocketFunction, onDisconnect: SocketFunction, onMessage: SocketFunction, onError: SocketFunction): void;

    sendMessage(to: string, content: string): void;

}