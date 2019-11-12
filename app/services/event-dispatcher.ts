import { LiteEvent } from "~/infrastructure/lite-event";

export class EventDispatcher {

    public readonly onMenuToggle = new LiteEvent<void>();

}