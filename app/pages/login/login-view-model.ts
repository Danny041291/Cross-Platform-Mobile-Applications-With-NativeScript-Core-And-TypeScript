import { Observable, EventData } from "tns-core-modules/data/observable";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import { LoginService } from "~/services/login-service";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";
import { Injectable } from "~/infrastructure/injectable-decorator";

export class LoginViewModel extends Observable {

    @Injectable
    loginService: LoginService;

    @ObservableProperty() username: string;
    @ObservableProperty() password: string;
    @ObservableProperty() rememberMe: boolean;

    constructor() {
        super();
    }

    async onLoginButtonTap(args: EventData): Promise<void> {
        const button: Button = <Button>args.object;
        const page: Page = button.page;
        try {
            await this.loginService.login(this.username, this.password, this.rememberMe);
            page.frame.navigate("home-page");
        } catch (error) {
            // Show error message
        }
    }

}