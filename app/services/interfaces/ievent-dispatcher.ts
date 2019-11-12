import { LiteEvent } from "~/infrastructure/lite-event";

export interface IEventDispatcher {

    onMenuToggle: LiteEvent<void>;

}