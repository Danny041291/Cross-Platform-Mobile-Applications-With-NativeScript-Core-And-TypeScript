import { Observable } from "tns-core-modules/data/observable";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { GlobalEventsDispatcher } from "~/infrastructure/global-events-dispatcher";
import { EVENTS } from "~/config/enums";

export class HeaderViewModel extends Observable {

    @Injectable
    globalEventsDispatcher: GlobalEventsDispatcher;

    constructor() {
        super();
    }

    onMenuButtonTap(): void {
        this.globalEventsDispatcher.triggerEvent(EVENTS.TOGGLE_MENU);
    }

}