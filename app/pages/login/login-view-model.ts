import { Observable, EventData } from "tns-core-modules/data/observable";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import { LoginService } from "~/services/login-service";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { RadDataForm } from "nativescript-ui-dataform";

export class LoginViewModel extends Observable {

    @Injectable
    loginService: LoginService;

    private _loginDataForm: RadDataForm;

    @ObservableProperty()
    loginForm = {
        username: null,
        password: null,
        rememberMe: false
    };

    constructor(page: Page) {
        super();
        this._loginDataForm = <RadDataForm>page.getViewById("loginForm");
    }

    async onLoginButtonTap(args: EventData): Promise<void> {
        var valid = await this._loginDataForm.validateAll();
        if (!valid) return;
        const button: Button = <Button>args.object;
        const page: Page = button.page;
        try {
            await this.loginService.login(this.loginForm.username, this.loginForm.password, this.loginForm.rememberMe);
            page.frame.navigate("/pages/home/home-page");
        } catch (error) {
            // Show error message
        }
    }

}