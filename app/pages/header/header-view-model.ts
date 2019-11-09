import { Observable, EventData } from "tns-core-modules/data/observable";
import { LoginService } from "~/services/login-service";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { getFrameById } from "tns-core-modules/ui/frame";

export class HeaderViewModel extends Observable {

    @Injectable
    loginService: LoginService;

    private _drawer: any;

    constructor(page: Page) {
        super();
        var drawerImage = getFrameById("body");
        this._drawer = drawerImage.getViewById('sideDrawer');
    }

    onMenuButtonTap(): void {
        this._drawer.toggleDrawerState();
    }

    onLogoutButtonTap(args: EventData): void {
        this.loginService.logout();
        const button: Button = <Button>args.object;
        const page: Page = button.page;
        page.frame.navigate("login-page");
    }

}