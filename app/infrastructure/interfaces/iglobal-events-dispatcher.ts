export interface IGlobalEventsDispatcher {

    addEvent<T>(id: string);

    listenEvent<T>(id: string, callback: (payload : T) => void): void;

    unlistenEvent(id: string) : void;

    clearEvents() : void;

    triggerEvent(id: string);

}