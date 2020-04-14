import { LoginViewModel } from "~/pages/login/login-view-model";
import { LoginService } from "~/services/login-service";
import { Storage } from "~/infrastructure/storage";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";
import { RadDataForm } from "nativescript-ui-dataform";
import { EventData } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame/frame";
import { IoCContainer } from "~/infrastructure/ioc-container";

// More details here: https://docs.nativescript.org/tooling/testing/testing
describe("Login Page", () => {

  let loginService: LoginService;
  let loginViewModel: LoginViewModel;
  let page: Page;

  beforeEach(() => {
    var storage = new Storage();
    IoCContainer.bind(Storage, storage);
    loginService = new LoginService();
    IoCContainer.bind(LoginService, loginService);
    var radDataForm = new RadDataForm();
    spyOn(radDataForm, 'validateAll').and.returnValue(Promise.resolve(true));
    page = new Page();
    spyOn(page, 'getViewById').withArgs('loginForm').and.returnValue(radDataForm);
    loginViewModel = new LoginViewModel(page);
  });

  it("Should call the login service after tapping the 'Login' button", async () => {
    var frame = new Frame();
    spyOn(frame, 'navigate').withArgs("/pages/home/home-page");
    spyOnProperty(page, 'frame').and.returnValue(frame);
    var button = new Button();
    spyOnProperty(button, "page").and.returnValue(page);
    var login = spyOn(loginService, 'login');
    loginViewModel.loginForm.username = "Username";
    loginViewModel.loginForm.password = "Password";
    loginViewModel.loginForm.rememberMe = true;
    var args = { eventName: 'event', object: button } as EventData;
    await loginViewModel.onLoginButtonTap(args);
    expect(login).toHaveBeenCalledWith("Username", "Password", true);
  });

});  