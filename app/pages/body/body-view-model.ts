import { Observable, EventData } from "tns-core-modules/data/observable";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { GlobalEventsDispatcher } from "~/infrastructure/global-events-dispatcher";
import { Page } from "tns-core-modules/ui/page/page";
import { LoginService } from "~/services/login-service";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import { exit } from 'nativescript-exit';
import { EVENTS } from "~/config/enums";
import { IdentityService } from "~/services/identity-service";

export class BodyViewModel extends Observable {

    @Injectable
    globalEventsDispatcher: GlobalEventsDispatcher;

    @Injectable
    loginService: LoginService;

    @Injectable
    identityService: IdentityService;

    @ObservableProperty() username: string;
    @ObservableProperty() menuFooterItems = new Array<string>("Information", "About Us", "Privacy");
    @ObservableProperty() accessPage : string;

    private _drawer: any;

    constructor(page: Page) {
        super();
        this._drawer = page.getViewById('sideDrawer') as any;
        this.globalEventsDispatcher.listenEvent(EVENTS.TOGGLE_MENU, () => this._drawer.toggleDrawerState());
        this.loginService.onUserLogin.on(() => this.username = "Hello " + this.loginService.user.username + "!");
        this.loginService.onUserLogout.on(() => this.username = null);
        if(this.loginService.user.isLogged) {
            this.accessPage = "/pages/home/home-page" ;
            this.username = "Hello " + this.loginService.user.username + "!"
        } else this.accessPage = "/pages/login/login-page";
    }

    onLogoutButtonTap(args: EventData): void {
        this.loginService.logout();
        this.identityService.unloadIdentity();
        this._drawer.toggleDrawerState();
        topmost().navigate("/pages/login/login-page");
    }

    onQuitButtonTap(args: EventData): void {
        exit();
    }

}