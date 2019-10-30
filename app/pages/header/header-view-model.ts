import { Observable, EventData } from "tns-core-modules/data/observable";
import { LoginService } from "~/services/login-service";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";
import { Injectable } from "~/infrastructure/injectable-decorator";

export class HeaderViewModel extends Observable {

    @Injectable
    loginService: LoginService;

    constructor() {
        super();
    }

    onLogoutButtonTap(args: EventData): void {
        this.loginService.logout();
        const button: Button = <Button>args.object;
        const page: Page = button.page;
        page.frame.navigate("login-page");
    }

}