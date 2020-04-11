import { LiteEvent } from "~/infrastructure/lite-event";
import { IGlobalEventsDispatcher } from "./interfaces/iglobal-events-dispatcher";
import { EVENTS } from "~/config/enums";

export class GlobalEventsDispatcher implements IGlobalEventsDispatcher {

    private events: Map<string, LiteEvent<any>>;

    constructor() {
        this.events = new Map<string, LiteEvent<any>>();
    }

    public addEvent<T>(id: EVENTS) : void {
        this.events.set(id, new LiteEvent<T>());
    }

    public listenEvent<T>(id: EVENTS, callback: (payload: T) => void) : void {
        (this.events.get(id) as LiteEvent<T>).on(callback);
    }

    public triggerEvent(id: EVENTS) : void {
        this.events.get(id).trigger();
    }

    public unlistenEvent(id: EVENTS) : void {
        this.events.delete(id);
    }

    public clearEvents() : void {
        this.events.clear();
    }

}