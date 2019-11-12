import { Observable, EventData } from "tns-core-modules/data/observable";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { EventDispatcher } from "~/services/event-dispatcher";
import { Page } from "tns-core-modules/ui/page/page";
import { LoginService } from "~/services/login-service";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import { exit } from 'nativescript-exit';

export class BodyViewModel extends Observable {

    @Injectable
    eventDispatcher: EventDispatcher;

    @Injectable
    loginService: LoginService;

    @ObservableProperty() username: string;

    private _drawer: any;

    constructor(page: Page) {
        super();
        this._drawer = page.getViewById('sideDrawer') as any;
        this.eventDispatcher.onMenuToggle.on(() => this._drawer.toggleDrawerState());
        this.loginService.onUserLogin.on(() => this.username = "Hello " + this.loginService.user.username + "!");
        this.loginService.onUserLogout.on(() => this.username = null);
    }

    onLogoutButtonTap(args: EventData): void {
        this.loginService.logout();
        this._drawer.toggleDrawerState();
        topmost().navigate("/pages/login/login-page");
    }

    onQuitButtonTap(args: EventData): void {
        exit();
    }

}