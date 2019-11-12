import { Observable } from "tns-core-modules/data/observable";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { EventDispatcher } from "~/services/event-dispatcher";

export class HeaderViewModel extends Observable {

    @Injectable
    eventDispatcher: EventDispatcher;

    constructor() {
        super();
    }

    onMenuButtonTap(): void {
        this.eventDispatcher.onMenuToggle.trigger();
    }

}